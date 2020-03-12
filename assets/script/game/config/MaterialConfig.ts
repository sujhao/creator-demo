import MaterialModel from "../model/MaterialModel";

export default class MaterialConfig {

    public static data: Array<MaterialModel> = [
        new MaterialModel(0, "金疮药", "体力回复15点"),
        new MaterialModel(1, "舍利子", "等级提升一级"),
        new MaterialModel(2, "蟠桃", "蟠桃"),
        new MaterialModel(3, "3", "蟠桃"),
        new MaterialModel(4, "4", "蟠桃"),
        new MaterialModel(5, "5", "蟠桃"),
        new MaterialModel(6, "6", "蟠桃"),
        new MaterialModel(7, "7", "蟠桃"),
        new MaterialModel(8, "8", "蟠桃"),
    ]


    /**
     * 根据物品id返回material
     * @param id 
     */
    public static getMaterialById(id: number) {
        for (let i = 0; i < this.data.length; i++) {
            let model: MaterialModel = this.data[i];
            if (model.id == id) {
                return model;
            }
        }
    }


}