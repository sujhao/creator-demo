import MaterialConfig from "../config/MaterialConfig";
import RandomUtil from "../../engine/utils/RandomUtil";

/**
 * 背包拥有物品
 */
export default class BagModel {
    public static modelList: Array<BagModel> = []
    public materialId: number = 0;
    public materialNum: number = 0;

    /**
     * 重新初始化背包
     */
    public static reInitNew() {
        this.modelList = [];
        // for (let i = 0; i < MaterialConfig.data.length; i++) {
            // this.modelList[i] = new BagModel();
            // this.modelList[i].materialId = MaterialConfig.data[i].id;
            // this.modelList[i].materialNum = RandomUtil.nextInt(0, 5);
        // }
    }

    /**
     * 根据缓存记录设置背包
     * @param bag 
     */
    public static initByRecord(bag: any) {
        let modelList: Array<BagModel> = [];
        for (let i = 0; i < bag.length; i++) {
            let bagItem: object = bag[i]
            let model: BagModel = new BagModel();
            model.materialId = bagItem["materialId"]
            model.materialNum = bagItem["materialNum"]
            modelList[i] = model;
        }
        return modelList;
    }

    public static addOne(materialId: number) {
        let hadAdd:boolean = false;
        for (let i = this.modelList.length - 1; i >= 0; i--) {
            let model: BagModel = this.modelList[i];
            if (model.materialId == materialId) {
                model.materialNum++;
                hadAdd = true;
                break;
            }
        }
        if(!hadAdd){
            let model:BagModel = new BagModel();
            model.materialId = materialId;
            model.materialNum = 1;
            this.modelList.push(model)
        }
        
    }

    public static useOne(materialId: number) {
        for (let i = this.modelList.length - 1; i >= 0; i--) {
            let model: BagModel = this.modelList[i];
            if (model.materialId == materialId) {
                model.materialNum--;
                if (model.materialNum <= 0) {
                    this.modelList.splice(i, 1)
                }
            }
        }
    }

    public static toString() {
        return JSON.stringify(this.modelList)
    }

}
