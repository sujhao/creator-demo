export default class Grid {

    public row:number;
    public col:number;

    constructor(row:number, col){
        this.row = row;
        this.col = col;
    }

    public static init(row:number, col:number){
        return new Grid(row, col)
    }
}