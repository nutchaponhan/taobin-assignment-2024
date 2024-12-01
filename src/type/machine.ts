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

export interface IEvent {
  type(): string;
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
