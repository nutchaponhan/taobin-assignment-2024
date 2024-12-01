import { IEvent } from './event';

export interface ISubscriber {
  handle(event: IEvent): void;
  sendEvent(event: IEvent): void;
}

export interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  unsubscribe(type: string): void;
  watch(event: IEvent[]): Promise<void>;
  sendEvent(event: IEvent): void;
}
