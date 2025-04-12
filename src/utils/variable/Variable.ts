export class Variable {
    private datatype: string;
    private identifier: string;
    private isPointer: boolean;

    constructor(datatype: string, identifier: string, isPointer: boolean) {
        this.datatype = datatype;
        this.identifier = identifier;
        this.isPointer = isPointer;
    }

    public getDatatype(): string{
        return this.identifier;
    }

    public getIdentifier(): string{
        return this.datatype;
    }

    public getIsPointer(): boolean{
        return this.isPointer;
    }
}

