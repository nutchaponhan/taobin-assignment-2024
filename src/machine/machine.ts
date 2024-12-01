import { IMachine, matchState, MachineState } from '../type';

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
