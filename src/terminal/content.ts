const files = import.meta.glob("/src/content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function getContent(src: string): string | null {
  return (files[src] as string) ?? null;
}
