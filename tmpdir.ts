if (Deno.build.os == "windows") {
  console.log(
    Deno.env.get("TEMP") ??
      Deno.env.get("TMP") ??
      `${Deno.env.get("SYSTEMROOT")!}\\Temp`,
  );
} else {
  console.log(Deno.env.get("TMPDIR") ?? "/tmp");
}
