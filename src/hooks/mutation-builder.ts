import { DebounceOptions } from "./debounce";
import { SingleFlight } from "./single-flight";
import { debounce } from "./debounce";

type MutationFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

export class MutationBuilder<TData, Args extends any[], IsDebounce extends boolean = false> {
  private fn: MutationFunction<TData, Args>;
  private singleFlightInstance: SingleFlight;
  private debounceOptions: DebounceOptions = { ms: 0 };
  private isDebounce: boolean = false;
  private isSingleFlight: boolean = false;
  private isInternalPending: boolean = false;
  constructor(fn: (...args: Args) => TData, singleFlight: SingleFlight) {
    this.fn = async (...args: Args) => fn(...args);
    this.singleFlightInstance = singleFlight;
  }

  debounce(options: DebounceOptions): MutationBuilder<TData, Args, true> {
    this.isDebounce = true;
    this.debounceOptions = options;
    return this as unknown as MutationBuilder<TData, Args, true>;
  }

  singleFlight() {
    this.isSingleFlight = true;
    return this;
  }

  done(): IsDebounce extends true ? (...args: Args) => Promise<TData | null> : (...args: Args) => Promise<TData> {
    let mutation = this.fn;

    if (this.isSingleFlight) {
      const singleFlightMutation = this.singleFlightInstance.execute(mutation);
      mutation = async (...args: Args) => {
        const result = await singleFlightMutation(...args);
        return result;
      };
    }

    if (this.isDebounce) {
      //@ts-ignore
      mutation = debounce(mutation, this.debounceOptions) as MutationFunction<TData | null, Args>;
    }

    return mutation as IsDebounce extends true
      ? (...args: Args) => Promise<TData | null>
      : (...args: Args) => Promise<TData>;
  }
}
