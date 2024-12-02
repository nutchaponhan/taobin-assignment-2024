import {
  IMachine,
  matchState,
  MachineState,
  IMachineRepository,
} from '../type';

export class Machine implements IMachine {
  public id: string;
  public stockLevel = 10;
  public state: MachineState = matchState.stockOk;

  constructor(id: string) {
    this.id = id;
  }
}

export class MachineRepository implements IMachineRepository {
  constructor(private machines: IMachine[]) {}

  find(id: string): IMachine {
    return this.machines.find((m) => m.id === id) as IMachine;
  }

  update(machine: IMachine): IMachine {
    const index = this.machines.findIndex((m) => m.id === machine.id);
    if (index !== -1) {
      this.machines[index] = machine;
    }

    console.log({ state: this.machines });
    return this.machines[index];
  }
}
