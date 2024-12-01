Assignment PubSub mechanism

Requirement

1. on **IPublishSubscribeService**

   - implement **subscribe** to registering subscribers
   - implement **publish** method to publish event to all subscribers (subscribers should be working off a shared array of Machine objects)
   - implement **unsubscribe** allow handlers to unsubscribe from events

2. implement **MachineRefillSubscriber**

   - increase the stock quantity of the machine

3. implement new behavior

   - if a machine stock levels drops below 3 a new Event, LowStockWarningEvent should be generated
   - if a stock levels hits 3 or above, StockLevelOkEvent should be generated
   - LowStockWarningEvent or StockLevelOkEvent should only fire one time when crossing the threshold of 3 for each machine
