import { createFederationBuilder, type KvStore } from "@fedify/fedify";
import {
  Accept,
  Article,
  Delete,
  Endpoints,
  Follow,
  Person,
  Undo,
} from "@fedify/vocab";
import { LanguageString } from "@fedify/vocab-runtime";
import { siteUrl } from "../site";
import {
  actorIdentifier,
  actorName,
  actorNames,
  actorSummary,
  actorSummaries,
  outboxPageSize,
} from "./config";
import { createArticle, createPostActivity, type FederatedPost } from "./model";
import {
  getFollowers,
  getOrCreateActorKeyPairs,
  removeFollower,
  saveFollower,
} from "./store";

export interface FederationContextData {
  readonly kv: KvStore;
  readonly getPosts: () => Promise<readonly FederatedPost[]>;
  readonly deployId?: string;
}

export const builder = createFederationBuilder<FederationContextData>();

builder
  .setActorDispatcher(
    "/ap/actors/{identifier}",
    async (context, identifier) => {
      if (identifier !== actorIdentifier) return null;
      const keyPairs = await context.getActorKeyPairs(identifier);
      const firstKeyPair = keyPairs[0];
      if (firstKeyPair == null) throw new Error("The actor has no key pair.");
      return new Person({
        id: context.getActorUri(identifier),
        preferredUsername: identifier,
        names: [
          actorName,
          ...Object.entries(actorNames).map(
            ([language, name]) => new LanguageString(name, language),
          ),
        ],
        summaries: [
          actorSummary,
          ...Object.entries(actorSummaries).map(
            ([language, summary]) => new LanguageString(summary, language),
          ),
        ],
        url: siteUrl,
        inbox: context.getInboxUri(identifier),
        outbox: context.getOutboxUri(identifier),
        followers: context.getFollowersUri(identifier),
        endpoints: new Endpoints({ sharedInbox: context.getInboxUri() }),
        publicKey: firstKeyPair.cryptographicKey,
        assertionMethods: keyPairs.map((keyPair) => keyPair.multikey),
      });
    },
  )
  .setKeyPairsDispatcher(async (context, identifier) => {
    if (identifier !== actorIdentifier) return [];
    return getOrCreateActorKeyPairs(context.data.kv);
  });

builder
  .setInboxListeners("/ap/actors/{identifier}/inbox", "/ap/inbox")
  .on(Follow, async (context, follow) => {
    if (follow.id == null || follow.actorId == null || follow.objectId == null)
      return;
    const target = context.parseUri(follow.objectId);
    if (target?.type !== "actor" || target.identifier !== actorIdentifier)
      return;
    const follower = await follow.getActor(context);
    if (follower?.id == null || follower.inboxId == null) return;
    const sharedInboxId = follower.endpoints?.sharedInbox?.href;
    await saveFollower(context.data.kv, {
      id: follower.id.href,
      inboxId: follower.inboxId.href,
      ...(sharedInboxId == null ? {} : { sharedInboxId }),
    });
    await context.sendActivity(
      { identifier: actorIdentifier },
      follower,
      new Accept({
        id: new URL(
          `#accepts/${encodeURIComponent(follow.id.href)}`,
          context.getActorUri(actorIdentifier),
        ),
        actor: context.getActorUri(actorIdentifier),
        object: follow,
      }),
      { orderingKey: follower.id.href },
    );
  })
  .on(Undo, async (context, undo) => {
    if (undo.actorId == null) return;
    const object = await undo.getObject(context);
    if (!(object instanceof Follow)) return;
    if (object.actorId?.href !== undo.actorId.href) return;
    if (object.objectId?.href !== context.getActorUri(actorIdentifier).href)
      return;
    await removeFollower(context.data.kv, undo.actorId);
  })
  .on(Delete, async (context, deletion) => {
    if (
      deletion.actorId == null ||
      deletion.objectId?.href !== deletion.actorId.href
    )
      return;
    await removeFollower(context.data.kv, deletion.actorId);
  });

builder.setFollowersDispatcher(
  "/ap/actors/{identifier}/followers",
  async (context, identifier) => {
    if (identifier !== actorIdentifier) return null;
    return { items: await getFollowers(context.data.kv) };
  },
);

builder.setObjectDispatcher(
  Article,
  "/ap/articles/{year}/{month}/{slug}",
  async (context, values) => {
    const posts = await context.data.getPosts();
    const post = posts.find(
      (candidate) =>
        candidate.year === values.year &&
        candidate.month === values.month &&
        candidate.slug === values.slug,
    );
    return post == null ? null : createArticle(context, post);
  },
);

builder
  .setOutboxDispatcher(
    "/ap/actors/{identifier}/outbox",
    async (context, identifier, cursor) => {
      if (identifier !== actorIdentifier || cursor == null) return null;
      const posts = await context.data.getPosts();
      const offset = cursor === "" ? 0 : Number.parseInt(cursor, 10);
      if (!Number.isSafeInteger(offset) || offset < 0) return null;
      const page = posts.slice(offset, offset + outboxPageSize);
      return {
        items: page.map((post) => createPostActivity(context, post)),
        nextCursor:
          offset + outboxPageSize < posts.length
            ? String(offset + outboxPageSize)
            : null,
      };
    },
  )
  .setFirstCursor(async (context, identifier) => {
    if (identifier !== actorIdentifier) return null;
    return (await context.data.getPosts()).length === 0 ? null : "";
  })
  .setCounter(async (context, identifier) => {
    if (identifier !== actorIdentifier) return 0;
    return (await context.data.getPosts()).length;
  });
