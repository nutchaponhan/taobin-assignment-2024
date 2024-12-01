import { MachineRefillEvent, MachineSaleEvent } from '../machine';
import { IEvent } from '../type';
import { randomMachine } from './helper';

/**
 *  this simple fn used to simulation simple plan for only publish sale event to machine "001"
 *  to testing "LowStockWarningEvent" was published and then we will publish "MachineRefillEvent"
 *  to see how stock was refill and publish "StockLevelOkEvent"
 * @returns IEvent
 */
export const simple = (): IEvent[] => {
  let simpleEvents = [];
  const machine01 = '001';
  const saleQty = Math.random() < 0.5 ? 2 : 4;

  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));
  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));
  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));
  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));
  simpleEvents.push(new MachineSaleEvent(saleQty, machine01));

  const refillQty = Math.random() < 0.5 ? 3 : 5;
  simpleEvents.push(new MachineRefillEvent(refillQty, machine01));
  simpleEvents.push(new MachineRefillEvent(refillQty, machine01));
  simpleEvents.push(new MachineRefillEvent(refillQty, machine01));

  return simpleEvents;
};
