import { Machine } from './machine';
import {
  IEvent,
  EventType,
  ISubscriber,
  eventType,
  IPublishSubscribeService,
  matchState,
  IMachineRepository,
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
  constructor(
    private machineRepository: IMachineRepository,
    private pubSubService: IPublishSubscribeService
  ) {}

  handle(event: MachineSaleEvent): void {
    const machineId = event.machineId();

    let machine = this.machineRepository.find(machineId);

    const prevMachineState = machine.state;

    machine.stockLevel -= event.getSoldQuantity();

    const stockLevelDrop = machine.stockLevel < 3;
    machine.state = stockLevelDrop ? matchState.stockLow : matchState.stockOk;

    machine = this.machineRepository.update(machine);

    if (stockLevelDrop && prevMachineState === matchState.stockOk) {
      this.sendEvent(
        new MachineLowStockWarningEvent(machine.stockLevel, machineId)
      );
    }
  }

  sendEvent(event: IEvent): void {
    this.pubSubService.sendEvent(event);
  }

  cancelSubscribe(): void {
    this.pubSubService.unsubscribe(eventType.sale);
  }
}
