import {
  IMachine,
  IEvent,
  IPublishSubscribeService,
  ISubscriber,
  matchState,
  MachineState,
  eventType,
  EventType,
} from './type/machine';

// implementations
export class MachineSaleEvent implements IEvent {
  constructor(
    private readonly _sold: number,
    private readonly _machineId: string
  ) {}

  machineId(): string {
    return this._machineId;
  }

  getSoldQuantity(): number {
    return this._sold;
  }

  type(): EventType {
    return eventType.sale;
  }
}

export class MachineRefillEvent implements IEvent {
  constructor(
    private readonly _refill: number,
    private readonly _machineId: string
  ) {}

  machineId(): string {
    return this._machineId;
  }

  type(): EventType {
    return eventType.refill;
  }

  getRefillStockLevel(): number {
    return this._refill;
  }
}

export class MachineLowStockWarningEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): EventType {
    return eventType.lowStock;
  }
}

export class MachineStockLevelOkEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): EventType {
    return eventType.stockLevelOk;
  }
}

export class MachineSaleSubscriber implements ISubscriber {
  public machines: Machine[];
  private pubSubService: IPublishSubscribeService;

  constructor(machines: Machine[], pubSubService: IPublishSubscribeService) {
    this.machines = machines;
    this.pubSubService = pubSubService;
  }

  handle(event: MachineSaleEvent): void {
    const machineId = event.machineId();
    const machineIndex = this.machines.findIndex(
      (m) => m.id === machineId
    ) as number;

    const machine = this.machines[machineIndex];
    const prevMachineState = this.machines[machineIndex].state;

    machine.changeStock(-event.getSoldQuantity());

    if (
      machine.stockLevel > 0 &&
      machine.stockLevel < 3 &&
      prevMachineState === matchState.stockOk
    ) {
      this.sendEvent(new MachineLowStockWarningEvent(machineId));
    } else if (machine.stockLevel <= 0) {
      this.cancelSubscribe();
    }

    console.log({ state: this.machines });
  }

  sendEvent(event: IEvent): void {
    this.pubSubService.sendEvent(event);
  }

  cancelSubscribe(): void {
    this.pubSubService.unsubscribe('sale');
  }
}

export class MachineRefillSubscriber implements ISubscriber {
  public machines: Machine[];
  private pubSubService: IPublishSubscribeService;

  constructor(machines: Machine[], pubSubService: IPublishSubscribeService) {
    this.machines = machines;
    this.pubSubService = pubSubService;
  }

  handle(event: MachineRefillEvent): void {
    const machineId = event.machineId();
    const machineIndex = this.machines.findIndex(
      (m) => m.id === machineId
    ) as number;

    const machine = this.machines[machineIndex];
    const prevMachineState = this.machines[machineIndex].state;

    machine.changeStock(event.getRefillStockLevel());

    if (machine.stockLevel >= 3 && prevMachineState === matchState.stockLow) {
      this.sendEvent(new MachineStockLevelOkEvent(machineId));
    }

    console.log({ state: this.machines });
  }

  sendEvent(event: IEvent): void {
    this.pubSubService.sendEvent(event);
  }
}

export class MachineLowStockSubscriber implements ISubscriber {
  public machines: Machine[];
  private pubSubService: IPublishSubscribeService;

  constructor(machines: Machine[], pubSubService: IPublishSubscribeService) {
    this.machines = machines;
    this.pubSubService = pubSubService;
  }

  handle(event: MachineLowStockWarningEvent): void {
    const machineId = event.machineId();
    console.log(`stock machine id :${machineId} levels drops below 3`);
  }

  sendEvent(event: IEvent): void {
    this.pubSubService.sendEvent(event);
  }
}

export class MachineStockLevelOkSubscriber implements ISubscriber {
  public machines: Machine[];
  private pubSubService: IPublishSubscribeService;

  constructor(machines: Machine[], pubSubService: IPublishSubscribeService) {
    this.machines = machines;
    this.pubSubService = pubSubService;
  }

  handle(event: MachineStockLevelOkEvent): void {
    const machineId = event.machineId();
    console.log(`stock machine id :${machineId} levels hits 3 or above`);
  }

  sendEvent(event: IEvent): void {
    this.pubSubService.sendEvent(event);
  }
}

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

// objects
export class Machine implements IMachine {
  public id: string;
  public stockLevel = 10;
  public state: MachineState = matchState.stockOk;

  constructor(id: string) {
    this.id = id;
  }

  changeStock(adjustStockLevel: number): IMachine {
    this.stockLevel += adjustStockLevel;

    if (this.stockLevel < 3) {
      this.changeState(matchState.stockLow);
    } else if (this.stockLevel >= 3) {
      this.changeState(matchState.stockOk);
    }

    return this;
  }

  changeState(newState: MachineState): IMachine {
    this.state = newState;
    return this;
  }
}
