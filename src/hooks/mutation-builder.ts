import { DebounceOptions } from "./debounce";
import { SingleFlight } from "./single-flight";
import { debounce } from "./debounce";

type MutationFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

export class MutationBuilder<T, Args extends any[], IsDebounce extends boolean = false> {
  private fn: MutationFunction<T, Args>;
  private singleFlightInstance: SingleFlight;
  private debounceOptions: DebounceOptions = { ms: 0 };
  private isDebounce: boolean = false;
  private isPendingRefUse: boolean = false;
  private isSingleFlight: boolean = false;
  private isPending: { current: boolean };

  constructor(fn: (...args: Args) => T, singleFlight: SingleFlight, isPending: { current: boolean }) {
    this.fn = async (...args: Args) => fn(...args);
    this.singleFlightInstance = singleFlight;
    this.isPending = isPending;
  }

  pendingRef() {
    this.isPendingRefUse = true;
    return this;
  }

  debounce(options: DebounceOptions): MutationBuilder<T, Args, true> {
    this.isDebounce = true;
    this.debounceOptions = options;
    return this as unknown as MutationBuilder<T, Args, true>;
  }

  singleFlight() {
    this.isSingleFlight = true;
    return this;
  }

  done(): IsDebounce extends true ? (...args: Args) => Promise<T | null> : (...args: Args) => Promise<T> {
    let mutation = this.fn;

    if (this.isPendingRefUse) {
      mutation = async (...args: Args) => {
        this.isPending.current = true;
        const res = await this.fn(...args);
        this.isPending.current = false;
        return res;
      };
    }

    if (this.isSingleFlight) {
      const singleFlightMutation = this.singleFlightInstance.execute(mutation);
      mutation = async (...args: Args) => {
        const result = await singleFlightMutation(...args);
        return result;
      };
    }

    if (this.isDebounce) {
      //@ts-ignore
      mutation = debounce(mutation, this.debounceOptions) as MutationFunction<T | null, Args>;
    }

    return mutation as IsDebounce extends true ? (...args: Args) => Promise<T | null> : (...args: Args) => Promise<T>;
  }
}
