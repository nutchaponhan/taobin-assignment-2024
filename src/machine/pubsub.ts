import { IPublishSubscribeService, IEvent, ISubscriber } from '../type';

export class PublishSubscribeService implements IPublishSubscribeService {
  private _events: IEvent[] = [];
  private _subscriptions: Record<string, ISubscriber | null> = {};

  constructor(events: IEvent[]) {
    this._events = events;
  }

  sendEvent(event: IEvent): void {
    this._events.push(event);
  }

  publish(event: IEvent): void {
    const { type } = event;
    const subscriber = this._subscriptions[type()];

    if (!subscriber) {
      // reject transaction
      console.log('subscriber not found');
      return;
    }

    console.log('publish', event);
    subscriber.handle(event);
  }

  unsubscribe(type: string): void {
    console.log(`handle: ${type} was unsubscribe`);
    delete this._subscriptions[type];
  }

  subscribe(type: string, subscriber: ISubscriber): void {
    this._subscriptions[type] = subscriber;
  }

  watch(): void {
    while (this._events.length > 0) {
      const event = this._events.shift();
      this.publish(event as IEvent);
    }

    console.log('stop program no more events to process...');
  }
}
