import { Effect, Console } from "effect"

const program = Console.log("Hello, World!")
export const run = () => Effect.runSync(program)