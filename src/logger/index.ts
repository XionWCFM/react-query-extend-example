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
    // biome-ignore lint/complexity/noForEach: <explanation>
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

type LoggerProps = {
  children?: ReactNode;
};

const loggerPubSub = new Pubsub<"publish">();

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

// 최상위 layout에 위치 | children은 사용해도 , 사용하지않아도 무방
export const Logger = (props: LoggerProps) => {
  const { children } = props;
  useEffect(() => {
    const handler = (event: MyEvent["event"]) => {
      const { eventTuple, eventProperty } = event;
      const [feature, page, at, target, action] = eventTuple;
      const eventName = [feature, target, action].join("_");
      const eventPath = [feature, page, at, target].join("_");
      const log = {
        eventName,
        eventPath,
        eventProperty,
      };
      LogCollection.add(log, action);
    };
    loggerPubSub.subscribe("publish", handler);
    return () => {
      loggerPubSub.unsubscribe("publish", handler);
    };
  }, []);

  return children;
};

// 이벤트 정의
type FEATURE = "azito";
type PAGE = "home" | "signin" | "signup";
type AT = "cta-area" | "footer" | "header" | "banner";
type TARGET = "cta-button";
type ACTION = "click" | "page" | "track" | "view";

type EventCreator<Feature, Page, At, Target, Action> = {
  eventTuple: [Feature, Page, At, Target, Action];
  nameTuple: [Feature, Target, Action];
  pathTuple: [Feature, Page, At, Target];
  event: { eventTuple: [Feature, Page, At, Target, Action]; eventProperty: EventProperty };
};

type MyEvent = EventCreator<FEATURE, PAGE, AT, TARGET, ACTION>;

type EventProperty = Record<string, unknown>;

// 로깅이 필요한곳에서 가져온 뒤 호출
// 인자 1엔 로깅에 사용할 정보 주입, 2엔 프로퍼티 주입
// const handleClick = () => {
//   logger.track(["azito", "home", "banner", "cta-button", "click"], { hello: "world" });
// };
export const logger = {
  track: (eventTuple: MyEvent["eventTuple"], eventProperty?: EventProperty) => {
    loggerPubSub.publish<MyEvent["event"]>("publish", { eventTuple, eventProperty: eventProperty ?? {} });
  },
};
