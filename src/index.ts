import {
  Machine,
  MachineRefillSubscriber,
  MachineSaleEvent,
  MachineSaleSubscriber,
  PublishSubscribeService,
} from './main';

import { eventGenerator } from './utils/helper';

// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [
    new Machine('001'),
    new Machine('002'),
    new Machine('003'),
  ];

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber(machines);
  const refillSubscriber = new MachineRefillSubscriber(machines);

  // create the PubSub service
  const pubSubService = new PublishSubscribeService();

  pubSubService.subscribe('sale', saleSubscriber);
  pubSubService.subscribe('refill', refillSubscriber);

  // create 5 random events
  const events = [1, 2, 3, 4, 5].map((i) => eventGenerator());

  // publish the events
  events.map((e) => pubSubService.publish(e));
})();
