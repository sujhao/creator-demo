export default class GiftModel {

    public materialId: number;
    public row: number;
    public col: number;
    public isShow: boolean = false;
    public isOpen: boolean = false;

    constructor(materialId: number, row: number, col: number, isShow: boolean, isOpen: boolean = false) {
        this.materialId = materialId;
        this.row = row;
        this.col = col;
        this.isShow = isShow;
        this.isOpen = isOpen;
    }
}