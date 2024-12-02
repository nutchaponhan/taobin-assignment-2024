import { IEvent } from './event';

export abstract class ISubscriber {
  abstract handle(event: IEvent): void;
  abstract sendEvent(event: IEvent): void;
}

export abstract class IPublishSubscribeService {
  abstract publish(event: IEvent): void;
  abstract subscribe(type: string, handler: ISubscriber): void;
  abstract unsubscribe(type: string): void;
  abstract watch(event: IEvent[]): Promise<void>;
  abstract sendEvent(event: IEvent): void;
}
