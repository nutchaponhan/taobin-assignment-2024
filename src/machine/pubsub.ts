import { IPublishSubscribeService, IEvent, ISubscriber } from '../type';

import { delay } from '../utils';

export class PublishSubscribeService implements IPublishSubscribeService {
  private _events: IEvent[] = [];
  private _subscriptions: Record<string, ISubscriber | null> = {};

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
    console.log(`subscriber was unsubscribe event: ${type} `);
    delete this._subscriptions[type];
  }

  subscribe(type: string, subscriber: ISubscriber): void {
    this._subscriptions[type] = subscriber;
  }

  async watch(events: IEvent[]): Promise<void> {
    this._events = [...this._events, ...events];

    while (true) {
      if (this._events.length > 0) {
        const event = this._events.shift();
        this.publish(event as IEvent);
      } else {
        console.log('No events to process, waiting for 1 second...');
        await delay(1000);
      }
    }
  }
}
