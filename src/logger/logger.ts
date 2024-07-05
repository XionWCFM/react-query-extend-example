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

const createLogger = <
  Feature extends string,
  Page extends string,
  At extends string,
  Target extends string,
  Action extends string,
>() => {
  const eventType = "publish" as const;
  type EventType = typeof eventType;
  type EventTuple = [Feature, Page, At, Target, Action];
  type EventProperty = Record<string, unknown>;
  type InternalEvent = { eventTuple: EventTuple; eventProperty: EventProperty };

  const pubsub = new Pubsub<EventType>();
  const subscribe = (handler: (event: InternalEvent) => void) => {
    return pubsub.subscribe(eventType, handler);
  };
  const unsubscribe = (handler: (event: InternalEvent) => void) => {
    return pubsub.unsubscribe(eventType, handler);
  };
  const track = (eventTuple: EventTuple, property?: EventProperty) => {
    const event: InternalEvent = { eventTuple, eventProperty: property ?? {} };
    return pubsub.publish<InternalEvent>(eventType, event);
  };
  return { subscribe, unsubscribe, track };
};

type LoggerProps = {
  children?: ReactNode;
};

type LogEvent<T extends { subscribe: (...args: any[]) => void }> = Parameters<Parameters<T["subscribe"]>["0"]>["0"];

// 이벤트 작성
type FEATURE = "azito";
type PAGE = "home" | "signin" | "signup";
type AT = "cta-area" | "footer" | "header" | "banner";
type TARGET = "cta-button";
type ACTION = "click" | "page" | "track" | "view";

class LogCollection {
  static async add(data: Record<string, unknown>, action: ACTION) {
    await new Promise((res) => setTimeout(res, 1000));
    // firestore 업로드 코드로 변경
    switch (action) {
      case "click":
        return console.log("click 으로 업로드");
      case "page":
        return console.log("page 으로 업로드");
      case "track":
        return console.log("track 으로 업로드");
      case "view":
        return console.log("view 으로 업로드");
      default:
        throw new Error();
    }
  }
}
// example :
// logger.track(["azito", "home", "banner", "cta-button", "click"], {});
export const logger = createLogger<FEATURE, PAGE, AT, TARGET, ACTION>();

// layout에서 사용 , 칠드런은 감싸도되고, 안감싸도상관없음
export const Logger = (props: LoggerProps) => {
  const { children } = props;
  useEffect(() => {
    const handler = (event: LogEvent<typeof logger>) => {
      const { eventTuple, eventProperty } = event;
      const [feature, page, at, target, action] = eventTuple;
      const eventName = [feature, target, action].join("_");
      const eventPath = [feature, page, at, target].join("_");
      const log = { eventName, eventPath, eventProperty };
      LogCollection.add(log, action);
    };
    logger.subscribe(handler);
    return () => {
      logger.unsubscribe(handler);
    };
  }, []);

  return children;
};
