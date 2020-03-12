import MaterialModel from "../model/MaterialModel";
import MagicModel from "../model/MagicModel";

export default class MagicConfig {


    public static data: Array<MagicModel> = [
        new MagicModel(0, "御剑术", 2, "法力消耗  3点"),
        new MagicModel(1, "炎杀", 3, "法力消耗  8点"),
        new MagicModel(2, "哮天犬", 5, "法术消耗 3点"),
        new MagicModel(3, "魔法箭", 4, "法术消耗 3点"),
        new MagicModel(4, "回复", 4, " 法术消耗 3点"),
        new MagicModel(5, "万剑穿心", 8, "法术消耗 3点"),
    ]

    public static getMagicById(id:number){
        for(let i=0; i<this.data.length; i++){
            let model:MagicModel = this.data[i];
            if(model.id == id){
                return model;
            }
        }
    }

}