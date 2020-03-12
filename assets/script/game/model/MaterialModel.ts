export default class MaterialModel {
    public id:number = 0;
    public name:string = ""
    public desc:string = "";

    /**
     * 背包物品
     * @param id  
     * @param name 
     */
    constructor(id:number, name:string, desc:string=""){
        this.id = id;
        this.name = name;
        this.desc = desc;
    }
}