// interfaces
export const matchState = {
  stockLow: 'stockLow',
  stockOk: 'stockOk',
  stockUnknown: 'stockUnknown',
} as const;

export type MachineState = (typeof matchState)[keyof typeof matchState];

export interface IMachine {
  id: string;
  stockLevel: number;
  state: MachineState;
  changeStock(adjustStockLevel: number): IMachine;
  changeState(newState: MachineState): IMachine;
}

export const eventType = {
  sale: 'sale',
  refill: 'refill',
  lowStock: 'lowStock',
  stockLevelOk: 'stockLevelOk',
} as const;

export type EventType = (typeof eventType)[keyof typeof eventType];

export interface IEvent {
  type(): EventType;
  machineId(): string;
}

export interface ISubscriber {
  handle(event: IEvent): void;
  sendEvent(event: IEvent): void;
}

export interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  unsubscribe(type: string): void;
  watch(event: IEvent[]): void;
  sendEvent(event: IEvent): void;
}
