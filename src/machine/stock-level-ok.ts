import { Machine } from './machine';
import {
  IEvent,
  EventType,
  eventType,
  ISubscriber,
  IPublishSubscribeService,
} from '../type';

export class MachineStockLevelOkEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): EventType {
    return eventType.stockLevelOk;
  }
}

export class MachineStockLevelOkSubscriber implements ISubscriber {
  constructor(
    private machines: Machine[],
    private pubSubService: IPublishSubscribeService
  ) {
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
