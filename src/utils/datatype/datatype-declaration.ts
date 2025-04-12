import { Datatype } from "./datatype";

class DatatypeDeclaration{
    private identifier: string;
    private datatype: Datatype;

    public constructor(identifier: string, datatype: Datatype){ 
        this.identifier = identifier;
        this.datatype = datatype;
    }
}

class DatatypeStructDeclaration extends DatatypeDeclaration{
    private members: DatatypeDeclaration[];

    constructor(identifier: string, datatype: Datatype, members: DatatypeDeclaration[]){
        super(identifier, datatype);
        this.members = members;
    }
}