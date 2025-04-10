export class Datatype{
    private datatypeName: string;
    private datatypeCode: string;
    private datatypeFormatSpecifier: string | null;
    private datatypeCategory: string;
    private datatypeOptionString: string;

    public constructor(
        datatypeName: string, 
        datatypeCode: string, 
        datatypeFormatSpecifier: string | null, 
        datatypeCategory: string,
        datatypeOptionString: string){ 
        this.datatypeName = datatypeName;
        this.datatypeCode = datatypeCode;
        this.datatypeFormatSpecifier = datatypeFormatSpecifier;
        this.datatypeCategory = datatypeCategory;
        this.datatypeOptionString = datatypeOptionString;
    }

    public getName(): string {
        return this.datatypeName;
    }

    public setName(name: string): void {
        this.datatypeName = name;
    }

    public getCode(): string {
        return this.datatypeCode;
    }
    public getFormatSpecifier(): string | null {
        return this.datatypeFormatSpecifier;
    }   

    public getCategory(): string {
        return this.datatypeCategory;
    }
    public getOptionString(): string {
        return this.datatypeOptionString;
    }


}