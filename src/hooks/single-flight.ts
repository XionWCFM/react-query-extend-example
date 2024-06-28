export class SingleFlight {
  private promises: Map<string, Promise<any>> = new Map();

  execute<T, Args extends any[]>(fn: (...args: Args) => Promise<T>): (...args: Args) => Promise<T> {
    return async (...args: Args): Promise<T> => {
      const key = this.createKey(fn, args);
      if (!this.promises.has(key)) {
        const promise = fn(...args);
        this.promises.set(key, promise);
        try {
          return await promise;
        } finally {
          this.promises.delete(key);
        }
      }
      return this.promises.get(key)!;
    };
  }

  private createKey(fn: Function, args: any[]): string {
    return JSON.stringify({ fn: fn, args });
  }
}


