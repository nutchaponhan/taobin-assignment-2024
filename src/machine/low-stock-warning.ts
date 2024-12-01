import { Machine } from './machine';
import {
  IEvent,
  EventType,
  eventType,
  ISubscriber,
  IPublishSubscribeService,
  IMachineRepository,
} from '../type';

export class MachineLowStockWarningEvent implements IEvent {
  constructor(
    private readonly _stockLevel: number,
    private readonly _machineId: string
  ) {}

  machineId(): string {
    return this._machineId;
  }

  getStockLevel(): number {
    return this._stockLevel;
  }

  type(): EventType {
    return eventType.lowStock;
  }
}

export class MachineLowStockSubscriber implements ISubscriber {
  constructor(private pubSubService: IPublishSubscribeService) {}

  handle(event: MachineLowStockWarningEvent): void {
    const machineId = event.machineId();
    const stockLevel = event.getStockLevel();
    console.log(
      `stock machine id :${machineId} stock level left ${stockLevel} ,levels drops below 3`
    );
  }

  sendEvent(event: IEvent): void {
    this.pubSubService.sendEvent(event);
  }
}
