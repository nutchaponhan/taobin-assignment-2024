import { IEvent, IPublishSubscribeService, ISubscriber } from './type/machine';

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

  type(): string {
    return 'sale';
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

  type(): string {
    return 'refill';
  }

  getRefillStockLevel(): number {
    return this._refill;
  }
}

export class MachineSaleSubscriber implements ISubscriber {
  public machines: Machine[];

  constructor(machines: Machine[]) {
    this.machines = machines;
  }

  handle(event: MachineSaleEvent): void {
    const machineId = event.machineId();
    const machineIndex = this.machines.findIndex(
      (m) => m.id === machineId
    ) as number;

    this.machines[machineIndex].stockLevel -= event.getSoldQuantity();

    console.log('next', { state: this.machines });
  }
}

export class MachineRefillSubscriber implements ISubscriber {
  public machines: Machine[];

  constructor(machines: Machine[]) {
    this.machines = machines;
  }

  handle(event: MachineRefillEvent): void {
    const machineId = event.machineId();
    const machineIndex = this.machines.findIndex(
      (m) => m.id === machineId
    ) as number;

    this.machines[machineIndex].stockLevel += event.getRefillStockLevel();

    console.log('next', { state: this.machines });
  }
}

export class PublishSubscribeService implements IPublishSubscribeService {
  public _subscriptions: Record<string, ISubscriber> = {};

  publish(event: IEvent): void {
    const { type } = event;
    console.log('publish', {
      type: type(),
      target: event.machineId(),
    });
    const handler = this._subscriptions[type()];
    handler.handle(event);
  }

  subscribe(type: string, handler: ISubscriber): void {
    this._subscriptions[type] = handler;
  }
}

// objects
export class Machine {
  public stockLevel = 10;
  public id: string;

  constructor(id: string) {
    this.id = id;
  }
}
