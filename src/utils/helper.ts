import { IEvent } from '../type';
import { MachineSaleEvent, MachineRefillEvent } from '../machine';

// helpers
export const randomMachine = (): string => {
  const random = Math.random() * 3;

  if (random < 1) {
    return '001';
  } else if (random < 2) {
    return '002';
  }

  return '003';
};

export const eventGenerator = (): IEvent => {
  const random = Math.random();

  if (random < 0.8) {
    const saleQty = Math.random() < 0.5 ? 3 : 5; // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine());
  }

  const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine());
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
