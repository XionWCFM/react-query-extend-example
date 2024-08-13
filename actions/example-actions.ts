"use server";

export const exampleAction = async (hello: string) => {
  console.log(`${hello} ${typeof window === "undefined" ? "server" : "client"}`);
};
