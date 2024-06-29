type SingleFlightType = {
  isPending: boolean;
  promise: Promise<any> | null;
};

export class SingleFlight {
  private promises: Map<string, SingleFlightType> = new Map();
  execute<T, Args extends any[]>(fn: (...args: Args) => Promise<T>): (...args: Args) => Promise<T> {
    return async (...args: Args): Promise<T> => {
      const key = this.createKey(fn, args);
      if (!this.promises.has(key)) {
        this.promises.set(key, { promise: null, isPending: true });
        const promise = fn(...args);
        this.promises.set(key, { promise, isPending: true });

        try {
          return await promise;
        } finally {
          this.promises.delete(key);
        }
      }
      return this.promises.get(key)!.promise;
    };
  }

  private createKey(fn: Function, args: any[]): string {
    return JSON.stringify({ fn: fn.toString().slice(0, 50), args });
  }
}
