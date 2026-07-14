import type { Config, Context } from "@netlify/functions";
import { enqueuePublicationSync } from "./on-deploy";

export default async (_request: Request, context: Context) => {
  const observedAt = new Date().toISOString();
  if (
    context.deploy.context === "production" &&
    context.deploy.published &&
    context.site.name != null
  ) {
    await enqueuePublicationSync({
      id: context.deploy.id,
      permalinkUrl: `https://${context.deploy.id}--${context.site.name}.netlify.app`,
      publishedAt: observedAt,
    });
  }
  return new Response(null, { status: 204 });
};

export const config: Config = {
  schedule: "@daily",
};
