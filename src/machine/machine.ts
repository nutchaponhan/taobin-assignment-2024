import {
  IMachine,
  matchState,
  MachineState,
  IMachineRepository,
} from '../type';

// objects
export class Machine implements IMachine {
  public id: string;
  public stockLevel = 10;
  public state: MachineState = matchState.stockOk;

  constructor(id: string) {
    this.id = id;
  }

  changeStock(adjustStockLevel: number): IMachine {
    this.stockLevel += adjustStockLevel;

    if (this.stockLevel < 3) {
      this.changeState(matchState.stockLow);
    } else if (this.stockLevel >= 3) {
      this.changeState(matchState.stockOk);
    }

    return this;
  }

  changeState(newState: MachineState): IMachine {
    this.state = newState;
    return this;
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
