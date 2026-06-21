import { readFile } from "fs/promises";
import path from "path";

const contentTypes = {
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

export default async function handler(req, res) {
  try {
    const origin = `https://${req.headers.host}`;
    const url = new URL(req.url ?? "/", origin);
    const pathname = url.pathname;

    if (pathname.startsWith("/assets/")) {
      const assetPath = new URL(`../dist/client${pathname}`, import.meta.url);
      const fileBuffer = await readFile(assetPath);
      const ext = path.extname(pathname).toLowerCase();
      res.setHeader("content-type", contentTypes[ext] ?? "application/octet-stream");
      res.statusCode = 200;
      res.end(fileBuffer);
      return;
    }

    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
    });

    const serverPath = new URL("../dist/server/server.js", import.meta.url);
    const serverModule = await import(serverPath.href);
    const response = await serverModule.default.fetch(request, {}, {});

    response.headers.forEach((value, name) => {
      res.setHeader(name, value);
    });

    res.statusCode = response.status;

    if (response.body) {
      const buffer = Buffer.from(await response.arrayBuffer());
      res.end(buffer);
    } else {
      res.end();
    }
  } catch (error) {
    console.error("API function error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal server error");
  }
}
