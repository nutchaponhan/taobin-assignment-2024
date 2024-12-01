// interfaces
export const matchState = {
  stockLow: 'stockLow',
  stockOk: 'stockOk',
  stockUnknown: 'stockUnknown',
} as const;

export type MachineState = (typeof matchState)[keyof typeof matchState];

export type IMachine = {
  id: string;
  stockLevel: number;
  state: MachineState;
};

export abstract class IMachineRepository {
  abstract find(id: string): IMachine;
  abstract update(machine: IMachine): IMachine;
}
