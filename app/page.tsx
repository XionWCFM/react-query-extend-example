import { getDehydratedQuery, Hydrate } from "~/src/hooks/dehydrated";
import { ExampleComponent } from "~/src/hooks/example-component";
import { exampleOptions, getServerQuery } from "~/src/hooks/use-example-query";

export default async function Home() {
  const value = await getDehydratedQuery(exampleOptions());
  const queries = [value];
  console.dir(`SERVERTIME : ${value.state.data}`);
  return (
    <Hydrate state={{ queries }}>
      <ExampleComponent />
    </Hydrate>
  );
}
