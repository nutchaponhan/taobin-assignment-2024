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

export class MachineLowStockWarningEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return 'lowStock';
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

    this.machines[machineIndex].stockLevel -= event.getSoldQuantity();

    if (this.machines[machineIndex].stockLevel < 3) {
      this.publish(new MachineLowStockWarningEvent(machineId));
    }

    console.log({ state: this.machines });
  }

  publish(event: IEvent): void {
    this.pubSubService.publish(event);
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

    this.machines[machineIndex].stockLevel += event.getRefillStockLevel();

    console.log({ state: this.machines });
  }

  publish(event: IEvent): void {
    this.pubSubService.publish(event);
  }
}

export class MachineLowStockSubscriber implements ISubscriber {
  public machines: Machine[];
  private pubSubService: IPublishSubscribeService;

  constructor(machines: Machine[], pubSubService: IPublishSubscribeService) {
    this.machines = machines;
    this.pubSubService = pubSubService;
  }

  handle(event: MachineRefillEvent): void {
    const machineId = event.machineId();
    console.log(`stock machine id :${machineId} levels drops below 3`);
  }

  publish(event: IEvent): void {
    this.pubSubService.publish(event);
  }
}

export class PublishSubscribeService implements IPublishSubscribeService {
  public _subscriptions: Record<string, ISubscriber | null> = {};

  publish(event: IEvent): void {
    const { type } = event;
    const subscriber = this._subscriptions[type()];

    if (!subscriber) {
      throw Error('subscriber not found');
    }

    subscriber.handle(event);
  }

  unsubscribe(type: string): void {
    delete this._subscriptions[type];
  }

  subscribe(type: string, subscriber: ISubscriber): void {
    this._subscriptions[type] = subscriber;
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
