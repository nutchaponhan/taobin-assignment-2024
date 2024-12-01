// interfaces
export interface IEvent {
  type(): string;
  machineId(): string;
}

export interface ISubscriber {
  handle(event: IEvent): void;
}

export interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  // unsubscribe ( /* Question 2 - build this feature */ );
}
