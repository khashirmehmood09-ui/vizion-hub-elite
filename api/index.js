export default async function handler(req, res) {
  const origin = `https://${req.headers.host}`;
  const url = new URL(req.url ?? "/", origin);
  const request = new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
  });

  const serverModule = await import("../dist/server/server.js");
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
}
