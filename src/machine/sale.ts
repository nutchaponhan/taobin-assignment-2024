import { Machine } from './machine';
import {
  IEvent,
  EventType,
  ISubscriber,
  eventType,
  IPublishSubscribeService,
  matchState,
} from '../type';
import { MachineLowStockWarningEvent } from './low-stock-warning';

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
