import { Machine } from './machine';
import {
  IEvent,
  EventType,
  eventType,
  ISubscriber,
  IPublishSubscribeService,
} from '../type';

export class MachineLowStockWarningEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): EventType {
    return eventType.lowStock;
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
