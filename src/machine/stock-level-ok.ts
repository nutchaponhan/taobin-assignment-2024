import { Machine } from './machine';
import {
  IEvent,
  EventType,
  eventType,
  ISubscriber,
  IPublishSubscribeService,
} from '../type';

export class MachineStockLevelOkEvent implements IEvent {
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
    return eventType.stockLevelOk;
  }
}

export class MachineStockLevelOkSubscriber implements ISubscriber {
  constructor(private pubSubService: IPublishSubscribeService) {}

  handle(event: MachineStockLevelOkEvent): void {
    const machineId = event.machineId();
    const stockLevel = event.getStockLevel();

    console.log(
      `stock machine id :${machineId} stock level left ${stockLevel} ,levels above or equal 3`
    );
  }

  sendEvent(event: IEvent): void {
    this.pubSubService.sendEvent(event);
  }
}
