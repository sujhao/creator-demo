import GiftModel from "../model/GiftModel";

export default class GiftConfig {

    private static config: Array<any> = [
        [
            [0, 0, 4, true]
        ]
    ];


    /**
     * 根据关卡获取当前关卡的宝箱列表
     * @param level 
     */
    public static getGiftModelByLevel(level: number) {
        let giftModelList: Array<GiftModel> = [];
        let arr: Array<any> = this.config[level - 1]
        for (let i = 0; i < arr.length; i++) {
            let giftModel: GiftModel = new GiftModel(arr[i][0], arr[i][1], arr[i][2], arr[i][3])
            giftModelList[i] = giftModel;
        }
        return giftModelList
    }

}