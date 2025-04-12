import { Variable } from "./Variable";


export class VariableScope {
    private variablesDict: { [identifier: string]: Variable; };

    public addVariable(variable: Variable){
        this.variablesDict[variable.getIdentifier()] = variable;
  
    }
    constructor() {
        this.variablesDict = {};
    }
}
