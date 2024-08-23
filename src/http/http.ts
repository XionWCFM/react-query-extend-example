import ky, { KyInstance } from "ky";
import { auth } from "./auth";

const instance = ky.create({
  prefixUrl: "http://localhost:3000",
  retry: { limit: 0 },
  timeout: 1000 * 60 * 3,
  hooks: {
    afterResponse: [
      async (request, option, response) => {
        const result = await response.json();
        console.group(`🐣 RESPONSE BY: ${request.url} 🐣`);
        //@ts-ignore
        console.log(`AUTHORIZED: ${request.headers?.get("Authorization")}`);
        console.dir(result);
        console.log(`STATUS: ${response.status}`);
        console.groupEnd();
      },
    ],
  },
});

const clientAuthInstance = instance.extend({
  prefixUrl: "http://localhost:3000",
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        const token = auth.getAccessToken();
        if (token) {
          console.log("hello workd", token);
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
      (request) => {
        console.log(`🎃 REQUEST AUTHORIZATION HEADER: ${request.headers.get(auth.AUTHORIZATION_HEADER)}`);
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const newToken = await auth.refreshAccessToken(clientAuthInstance);
          if (newToken) {
            console.log("newToken", newToken);
            request.headers.set("Authorization", `Bearer ${newToken}`);
            return ky(request);
          }
        }
        return response;
      },
    ],
  },
  retry: {
    limit: 2,
    methods: ["get", "post", "put", "patch", "delete"],
    statusCodes: [401],
    backoffLimit: 1000,
  },
});

const serverAuthInstance = instance.extend({});

const createHttp = (kyInstance: KyInstance) => ({
  instance: kyInstance,
  get: function get<Response = unknown>(...args: Parameters<typeof instance.get>): Promise<Response> {
    return kyInstance.get(...args).then((response) => response.json());
  },
  post: function post<Request = any, Response = unknown>(
    url: string,
    payload?: Request,
    option?: Parameters<typeof instance.put>["1"],
  ): Promise<Response> {
    return kyInstance.post(url, { ...option, json: payload }).then((response) => response.json());
  },
  put: function put<Request = any, Response = unknown>(
    url: string,
    payload?: Request,
    option?: Parameters<typeof instance.put>["1"],
  ): Promise<Response> {
    return kyInstance.put(url, { ...option, json: payload }).then((response) => response.json());
  },
});

export const http = createHttp(instance);

export const httpServerAuth = createHttp(serverAuthInstance);

export const httpClientAuth = createHttp(clientAuthInstance);
