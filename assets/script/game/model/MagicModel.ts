export default class MagicModel {
    public id: number = 0;
    public name: string = ""
    public power: number = 0;
    public desc: string = ""

    /**
     * 法术
     * @param id  
     * @param name
     * @param power 
     */
    constructor(id: number, name: string, power: number, desc: string="") {
        this.id = id;
        this.name = name;
        this.power = power;
        this.desc = desc;
    }
}