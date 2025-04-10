import { Variable } from "./Variable";

class VariableStruct extends Variable {
    private members: Variable[];
    constructor(datatype: string, identifier: string, isPointer: boolean) {
        super(datatype, identifier, isPointer);
        this.members = [];
    }
}
