import ky from "ky";

const instance = ky.create({
  prefixUrl: "http://localhost:3000",
  retry: { limit: 0 },
  timeout: 1000 * 60 * 3,
  hooks: {
    beforeRequest: [
      (request) => {
        console.group(`👾 REQUEST BY: ${request.url} 👾`);
        console.log(`BODY: ${request.body}`);
        console.groupEnd();
      },
    ],
    afterResponse: [
      async (request, option, response) => {
        const result = await response.json();
        console.group(`🐣 RESPONSE BY: ${request.url} 🐣`);
        console.dir(result);
        console.log(`STATUS: ${response.status}`);
        console.groupEnd();
      },
    ],
  },
});

export const http = {
  get: function get<Response = unknown>(...args: Parameters<typeof instance.get>): Promise<Response> {
    return instance.get(...args).then((response) => response.json());
  },
  post: function post<Request = any, Response = unknown>(
    url: string,
    payload?: Request,
    option?: Parameters<typeof instance.put>["1"],
  ): Promise<Response> {
    return instance.post(url, { ...option, json: payload }).then((response) => response.json());
  },
  put: function put<Request = any, Response = unknown>(
    url: string,
    payload?: Request,
    option?: Parameters<typeof instance.put>["1"],
  ): Promise<Response> {
    return instance.put(url, { ...option, json: payload }).then((response) => response.json());
  },
};
