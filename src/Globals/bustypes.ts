// import { RefAttributes } from "react";

export type EventMap = {
};


export type EventCallback<T extends keyof EventMap> = (...args: EventMap[T]) => void;
export type EventSubscription = { unsubscribe: () => void };
