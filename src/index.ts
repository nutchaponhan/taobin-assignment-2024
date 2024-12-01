import {
  Machine,
  MachineLowStockSubscriber,
  MachineRefillSubscriber,
  MachineSaleSubscriber,
  MachineStockLevelOkSubscriber,
  PublishSubscribeService,
} from './main';
import { eventType } from './type/machine';

import { eventGenerator } from './utils/helper';

// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [
    new Machine('001'),
    new Machine('002'),
    new Machine('003'),
  ];

  // create 10 random events
  const events = [1, 2, 3, 4, 5].map((i) => eventGenerator());

  // create the PubSub service
  const pubSubService = new PublishSubscribeService(events);

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber(machines, pubSubService);
  const refillSubscriber = new MachineRefillSubscriber(machines, pubSubService);
  const lowStockSubscriber = new MachineLowStockSubscriber(
    machines,
    pubSubService
  );
  const stockLevelOkSubscriber = new MachineStockLevelOkSubscriber(
    machines,
    pubSubService
  );

  pubSubService.subscribe(eventType.sale, saleSubscriber);
  pubSubService.subscribe(eventType.refill, refillSubscriber);
  pubSubService.subscribe(eventType.lowStock, lowStockSubscriber);
  pubSubService.subscribe(eventType.stockLevelOk, stockLevelOkSubscriber);

  // watch all events to process
  pubSubService.watch();
})();
