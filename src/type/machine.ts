// interfaces
export const matchState = {
  stockLow: 'stockLow',
  stockOk: 'stockOk',
  stockUnknown: 'stockUnknown',
} as const;

export type MachineState = (typeof matchState)[keyof typeof matchState];

export interface IMachine {
  id: string;
  stockLevel: number;
  state: MachineState;
  changeStock(adjustStockLevel: number): IMachine;
  changeState(newState: MachineState): IMachine;
}
