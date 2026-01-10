import { readFileSync } from "fs";
import { join } from "path";

const srcDir = join(import.meta.dir, "src");

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".mp3": "audio/mpeg",
  ".json": "application/json",
};

function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf("."));
  return mimeTypes[ext] || "application/octet-stream";
}

const server = Bun.serve({
  port: 1234,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname === "/" ? "/index.html" : url.pathname;

    // Serve from src directory
    const filePath = join(srcDir, pathname);

    try {
      const file = Bun.file(filePath);
      const exists = await file.exists();

      if (exists) {
        return new Response(file, {
          headers: {
            "Content-Type": getMimeType(pathname),
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch {
      // File not found, continue to 404
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🎵 Audio demo running at http://localhost:${server.port}`);
