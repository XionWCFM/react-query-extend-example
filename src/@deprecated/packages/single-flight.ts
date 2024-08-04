type SingleFlightType = {
  isFlight: boolean;
  promise: Promise<any> | null;
};

type ExecuteType<TData, Args extends any[]> = {
  key: unknown[];
  fn: (...args: Args) => Promise<TData>;
};

type PickFlightKey = { key: unknown[] };
export class SingleFlight {
  private promises: Map<string, SingleFlightType> = new Map();
  execute<TData, Args extends any[]>(body: ExecuteType<TData, Args>): (...args: Args) => Promise<TData> {
    const { fn } = body;
    const key = this.createKey(body.key);

    return async (...args: Args): Promise<TData> => {
      if (!this.promises.has(key)) {
        this.promises.set(key, { promise: null, isFlight: true });
        const promise = fn(...args);
        this.promises.set(key, { promise, isFlight: true });
        try {
          return await promise;
        } finally {
          this.promises.delete(key);
        }
      }
      return this.promises.get(key)!.promise as Promise<TData>;
    };
  }

  isFlight(props: PickFlightKey): boolean {
    const key = this.createKey(props.key);
    return this.promises.get(key)?.isFlight ?? false;
  }

  private createKey(key: unknown[]) {
    return JSON.stringify(key);
  }
}
