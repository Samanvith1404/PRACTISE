const http = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const { authenticate } = require("./auth");

const frontendDirectory = path.resolve(__dirname, "..", "frontend");
const port = Number(process.env.PORT) || 3000;
const staticFiles = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/login.js": ["login.js", "text/javascript; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"]
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > 10_000) {
      throw new Error("Request body is too large.");
    }
  }

  return JSON.parse(body);
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "POST" && requestUrl.pathname === "/api/login") {
    let credentials;
    try {
      credentials = await readJsonBody(request);
    } catch (error) {
      sendJson(response, 400, { error: error.message === "Request body is too large."
        ? error.message
        : "Request body must be valid JSON." });
      return;
    }

    if (typeof credentials.username !== "string" || typeof credentials.password !== "string") {
      sendJson(response, 400, { error: "Username and password are required." });
      return;
    }

    try {
      if (!authenticate(credentials.username, credentials.password)) {
        sendJson(response, 401, { error: "The username or password is incorrect." });
        return;
      }
    } catch (error) {
      console.error(error.message);
      sendJson(response, 503, { error: "Sign-in is not configured on this server." });
      return;
    }

    sendJson(response, 200, { message: "Credentials accepted." });
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  const file = staticFiles[requestUrl.pathname];
  if (!file) {
    sendJson(response, 404, { error: "Not found." });
    return;
  }

  try {
    const content = await readFile(path.join(frontendDirectory, file[0]));
    response.writeHead(200, {
      "Content-Type": file[1],
      "X-Content-Type-Options": "nosniff"
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    console.error("Could not serve frontend file:", error.message);
    sendJson(response, 500, { error: "Unable to serve the requested page." });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`CampusPortal is available at http://127.0.0.1:${port}`);
});
