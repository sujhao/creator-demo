import LocalStorage from "../../engine/utils/LocalStorage";
import { Logger } from "../../engine/utils/Logger";
import BagModel from "./BagModel";
import PlayerInfo from "./PlayerInfo";
import Base64Helper from "../../engine/utils/Base64Helper";
import HaoEncrypt from "../../engine/utils/HaoEncrypt";
import LevelInfo from "./LevelInfo";
import PlayerType from "./PlayerType";

/**
 * 存档
 */
export default class RecordModel {


    public level: number = 0; //关卡
    public bagModelList: Array<BagModel> = null; //背包物品
    public playerInfoList: Array<PlayerInfo> = null;//角色信息


    public static recordList: Array<RecordModel> = [];

    /**
     * 初始化所有本地缓存记录
     * @param recordNum 
     */
    public static initAll(recordNum: number = 4) {
        for (let i = 0; i < recordNum; i++) {
            this.recordList[i] = this.init(i)
        }
        Logger.log(this, "RecordModel.initAll", this.recordList)
    }

    /**
     * 初始化当前记录
     * @param index 
     */
    public static init(index: number = 1) {
        let record: string = LocalStorage.getItem("record" + index);
        Logger.log(this, "RecordModel.init", index, record)
        if (!record || record == "") {
            record = "{}";
        } else {
            record = HaoEncrypt.decode(record);
            Logger.log(this, "RecordModel.init222=", index, record)
            try {
                let recordObj: Object = JSON.parse(record)
                let bag: any = JSON.parse(recordObj["bag"])
                let playerList = JSON.parse(recordObj["playerInfo"])
                let recordModel: RecordModel = new RecordModel();
                recordModel.level = recordObj["level"];
                recordModel.bagModelList = BagModel.initByRecord(bag);
                recordModel.playerInfoList = PlayerInfo.initByRecord(playerList)
                return recordModel
            } catch (error) {
                LocalStorage.setItem("record" + index, null);
            }
        }
    }

    /**
     * 删除本地缓存
     * @param index 
     */
    public static deleteLocalStoryage(index: number = 0) {
        LocalStorage.setItem("record" + index, null);
        this.initAll();
    }

    /**
     * 保存游戏信息到本地缓存
     * @param index 
     */
    public static saveToLocaleStorage(index: number = 0) {
        let bag: string = BagModel.toString();
        Logger.log(this, "bag===", bag)
        let playerInfo: string = PlayerInfo.toString();
        Logger.log(this, "playerInfo===", playerInfo)
        let recordObj: Object = {};
        recordObj["level"] = LevelInfo.nowLevel; //当前关卡
        recordObj["bag"] = bag;
        recordObj["playerInfo"] = playerInfo;
        let recordStr: string = JSON.stringify(recordObj);
        let encryptStr: string = HaoEncrypt.encode(recordStr)
        Logger.log(this, "saveToLocaleStorage=", index, recordStr);
        // LocalStorage.setItem("record" + index, recordStr);
        LocalStorage.setItem("record" + index, encryptStr);
        this.initAll();
    }

    /**
     * 获取当前记录的自己玩家等级
     */
    public getPlayerLevel() {
        for (let i = 0; i < this.playerInfoList.length; i++) {
            let player: PlayerInfo = this.playerInfoList[i];
            if (player && player.playerType == PlayerType.jhao) {
                return player.level;
            }
        }
    }

    /**
     * 获取当前记录的自己玩家名字
     */
    public getPlayerName() {
        for (let i = 0; i < this.playerInfoList.length; i++) {
            let player: PlayerInfo = this.playerInfoList[i];
            if (player && player.playerType == PlayerType.jhao) {
                return player.name;
            }
        }
    }
}
