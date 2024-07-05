"use client";

import { ReactNode, useEffect } from "react";

type DefaultFunction = (...param: any[]) => void;
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

export const createLogger = <
  EventName extends string,
  EventProperty extends Record<string, unknown> = Record<string, unknown>,
>() => {
  const eventType = "publish" as const;
  type EventType = typeof eventType;
  type EventParam = { eventName: EventName; eventProperty: EventProperty };
  const pubsub = new Pubsub<EventType>();

  const subscribe = (handler: (event: EventParam) => void) => {
    return pubsub.subscribe(eventType, handler);
  };

  const unsubscribe = (handler: (event: EventParam) => void) => {
    return pubsub.unsubscribe(eventType, handler);
  };
  const track = (eventName: EventName, property?: EventProperty) => {
    const event: EventParam = { eventName, eventProperty: (property ?? {}) as EventProperty };
    return pubsub.publish<EventParam>(eventType, event);
  };

  const Logger = ({ children, handler }: { children?: ReactNode; handler: (event: EventParam) => void }) => {
    useEffect(() => {
      subscribe(handler);
      return () => unsubscribe(handler);
    }, [handler]);
    return <>{children}</>;
  };

  return [Logger, { track }] as const;
};

type LogEvent<T extends { subscribe: (...args: any[]) => void }> = Parameters<Parameters<T["subscribe"]>["0"]>["0"];
