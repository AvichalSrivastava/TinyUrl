import { handler } from "./handler/handler";

const event = {
  resource: "/shorten",
  path: "/shorten",
  httpMethod: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({
    url: "https://www.npmjs.com/package/uuid#uuidv7options-buffer-offset"
  }),
  isBase64Encoded: false
};

export const event2 = {
  resource: "/{shortCode}",
  path: "/32CGk5W",
  httpMethod: "GET",
  headers: {
    host: "localhost:3000",
    "user-agent": "PostmanRuntime/7.32.3"
  },
  pathParameters: {
    shortCode: "32CGk5W"
  },
  body: null,
  isBase64Encoded: false
};

export const event3 = {
  resource: "/redis",
  path: "/",
  httpMethod: "GET",
  headers: {
    host: "localhost:3000",
    "user-agent": "PostmanRuntime/7.32.3"
  },
  body: null,
  isBase64Encoded: false
};

async function run() {
  const result = await handler(event3 as any);
  console.log(JSON.stringify(result, null, 2));
}

run();