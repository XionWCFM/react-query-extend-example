class Pubsub<EventName extends string = string> {
  private events: Record<string, DefaultFunction[]>;
  constructor() {
    this.events = {};
  }
  subscribe(eventName: EventName, func: DefaultFunction) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    //@ts-ignore
    this.events[eventName].push(func);
  }
  unsubscribe(eventName: EventName, func: DefaultFunction) {
    const handlers = this.events[eventName];
    if (handlers) {
      this.events[eventName] = handlers.filter((handler) => handler !== func);
    }
  }
  publish<T = Record<string, any>>(eventName: EventName, context?: T) {
    if (!this.events[eventName]) {
      return;
    }
    //@ts-ignore
    this.events[eventName].forEach((func) => func(context));
  }
  clear(eventName?: EventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
  }
}

const getReferer = () => {
  if (typeof document === "undefined") {
    return "[ SERVER ]";
  }
  return document.referrer;
};

const getUserAgent = () => {
  if (typeof navigator === "undefined") {
    return "[ SERVER ]";
  }
  return navigator.userAgent;
};

const getEnvironment = () => {
  return process.env.NODE_ENV ?? "[ NO_ENVIRONMENT ]";
};

export const createLogger = <EventName extends string, EventProperty extends DynamicObject = DynamicObject>(
  option?: CreateLoggerParams,
) => {
  const eventType = option?.pubsubEventName ?? ("xionwcfm_logger_logging_event_publish" as const);
  type EventType = typeof eventType;
  type EventContext = { time: string; environment: string; referer: string; userAgent: string };
  type EventParam = { eventName: EventName; eventProperty: EventProperty; eventContext: EventContext };

  const pubsub = option?.pubsub ?? new Pubsub<EventType>();

  const subscribe = (handler: (event: EventParam) => void) => {
    return pubsub.subscribe(eventType, handler);
  };

  const unsubscribe = (handler: (event: EventParam) => void) => {
    return pubsub.unsubscribe(eventType, handler);
  };

  const track = async (eventName: EventName, property?: EventProperty) => {
    const eventProperty = (property ?? {}) as EventProperty;
    const eventContext: EventContext = {
      time: new Date().toISOString(),
      environment: getEnvironment(),
      referer: getReferer(),
      userAgent: getUserAgent(),
    };
    const event: EventParam = { eventName, eventProperty, eventContext };
    return pubsub.publish<EventParam>(eventType, event);
  };

  return { track, unsubscribe, subscribe };
};

//external Type
export type LoggerReturnStructure = {
  subscribe: (...args: any[]) => void;
  unsubscribe: (...args: any[]) => void;
  track: (...args: any[]) => Promise<void>;
};
export type GetCallbackHandlerParam<T extends (...args: any[]) => any> = Parameters<T>[0] extends (
  ...args: any[]
) => any
  ? (callback: Parameters<Parameters<T>["0"]>["0"]) => void
  : never;

// internal Type
type CreateLoggerParams = {
  pubsub?: Pubsub;
  pubsubEventName?: string;
};

type DynamicObject = Record<string, unknown>;

type DefaultFunction = (...param: any[]) => void;
