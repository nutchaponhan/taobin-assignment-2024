import {
  IEvent,
  EventType,
  eventType,
  ISubscriber,
  IPublishSubscribeService,
  matchState,
  IMachineRepository,
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
    private machineRepository: IMachineRepository,
    private pubSubService: IPublishSubscribeService
  ) {}

  handle(event: MachineRefillEvent): void {
    const machineId = event.machineId();

    let machine = this.machineRepository.find(machineId);

    const prevMachineState = machine.state;

    machine.stockLevel += event.getRefillStockLevel();

    const stockLevelOk = machine.stockLevel >= 3;
    machine.state = stockLevelOk ? matchState.stockOk : matchState.stockLow;

    machine = this.machineRepository.update(machine);

    if (stockLevelOk && prevMachineState === matchState.stockLow) {
      this.sendEvent(
        new MachineStockLevelOkEvent(machine.stockLevel, machineId)
      );
    }
  }

  sendEvent(event: IEvent): void {
    this.pubSubService.sendEvent(event);
  }
}
