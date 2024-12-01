import { MachineRefillEvent, MachineSaleEvent } from '../machine';
import { IEvent } from '../type';

/**
 *  this simple fn used to simulation simple plan for only publish sale event to machine "001"
 *  to testing "LowStockWarningEvent" was published and then we will publish "MachineRefillEvent"
 *  to see how stock was refill and publish "StockLevelOkEvent"
 * @returns IEvent
 */
export const simple = (): IEvent[] => {
  let simpleEvents = [];

  const machine01 = '001';
  const saleQty = 2;
  const refillQty = 5;

  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));
  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));
  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));
  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));
  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));

  simpleEvents.push(new MachineRefillEvent(refillQty, machine01));
  simpleEvents.push(new MachineRefillEvent(refillQty, machine01));
  simpleEvents.push(new MachineRefillEvent(refillQty, machine01));

  return simpleEvents;
};

/**
 *  this complex fn used to simulation complex plan for publish sale event to machine "001" and "002"
 *  to testing "LowStockWarningEvent" was published and then we will publish "MachineRefillEvent" on both 2 machine
 *  to see how stock was refill and publish "StockLevelOkEvent" in correct ordering
 * @returns IEvent
 */
export const complex = (): IEvent[] => {
  let complexEvents = [];

  const machines = ['001', '002'];
  const saleQty = 2;
  const refillQty = 5;

  for (const machine of machines) {
    complexEvents.push(new MachineSaleEvent(saleQty, machine));
    complexEvents.push(new MachineSaleEvent(saleQty, machine));
    complexEvents.push(new MachineSaleEvent(saleQty, machine));
    complexEvents.push(new MachineSaleEvent(saleQty, machine));
    complexEvents.push(new MachineSaleEvent(saleQty, machine));

    complexEvents.push(new MachineRefillEvent(refillQty, machine));
    complexEvents.push(new MachineRefillEvent(refillQty, machine));
    complexEvents.push(new MachineRefillEvent(refillQty, machine));
  }

  return complexEvents;
};
