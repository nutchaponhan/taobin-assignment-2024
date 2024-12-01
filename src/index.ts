import {
  Machine,
  MachineLowStockSubscriber,
  MachineRefillSubscriber,
  MachineRepository,
  MachineSaleSubscriber,
  PublishSubscribeService,
} from './machine';
import { MachineStockLevelOkSubscriber } from './machine/stock-level-ok';
import { eventType, IEvent } from './type';

import { eventGenerator, simple, complex } from './utils';

const args = process.argv.slice(2);

function simulateEvent(): IEvent[] {
  const [plan] = args;
  if (plan === 'simple') {
    return simple();
  }

  if (plan === 'complex') {
    return complex();
  }

  const events = [1, 2, 3, 4, 5].map((i) => eventGenerator());
  return events;
}

// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [
    new Machine('001'),
    new Machine('002'),
    new Machine('003'),
  ];

  const machineRepository = new MachineRepository(machines);

  // create the PubSub service
  const pubSubService = new PublishSubscribeService();

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber(
    machineRepository,
    pubSubService
  );
  const refillSubscriber = new MachineRefillSubscriber(
    machineRepository,
    pubSubService
  );
  const lowStockSubscriber = new MachineLowStockSubscriber(pubSubService);
  const stockLevelOkSubscriber = new MachineStockLevelOkSubscriber(
    pubSubService
  );

  pubSubService.subscribe(eventType.sale, saleSubscriber);
  pubSubService.subscribe(eventType.refill, refillSubscriber);
  pubSubService.subscribe(eventType.lowStock, lowStockSubscriber);
  pubSubService.subscribe(eventType.stockLevelOk, stockLevelOkSubscriber);

  // create 5 random events
  const events = simulateEvent();

  // watch all events to process
  pubSubService.watch(events);
})();
