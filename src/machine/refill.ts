import { Machine } from './machine';
import {
  IEvent,
  EventType,
  eventType,
  ISubscriber,
  IPublishSubscribeService,
  matchState,
} from '../type';
import { MachineStockLevelOkEvent } from './stock-level-ok';

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

export class MachineRefillSubscriber implements ISubscriber {
  constructor(
    private machines: Machine[],
    private pubSubService: IPublishSubscribeService
  ) {
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
