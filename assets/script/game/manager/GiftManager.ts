import GiftModel from "../model/GiftModel";
import GiftPrefab from "../prefab/GiftPrefab";
import GiftConfig from "../config/GiftConfig";
import LevelInfo from "../model/LevelInfo";
import ResourcePrefab from "../prefab/ResourcePrefab";
import TileMapBase from "../tilemap/TileMapBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GiftManager extends cc.Component {


    public static instatnce: GiftManager = null;

    @property({ type: cc.Node })
    public giftContainer: cc.Node = null;

    private giftList: Array<GiftPrefab> = [];

    onLoad() {
        GiftManager.instatnce = this;
    }


    /**
     * 初始化当前关卡宝箱
     */
    public init() {
        let giftList: Array<GiftModel> = GiftConfig.getGiftModelByLevel(LevelInfo.nowLevel)
        for (let i = 0; i < giftList.length; i++) {
            let giftModel: GiftModel = giftList[i];
            let giftNode: cc.Node = cc.instantiate(ResourcePrefab.getGiftPrefab());
            this.giftContainer.addChild(giftNode)
            giftNode.active = giftModel.isShow;
            giftNode.getComponent(GiftPrefab).giftModel = giftModel;
            giftNode.setPosition(TileMapBase.instatnce.getTileGlobalLocationByRowCol(giftModel.row, giftModel.col))
            this.giftList[i] = giftNode.getComponent(GiftPrefab);
        }
    }

    /**
     * 当前所在行列是否有宝箱
     * @param row 
     * @param col 
     */
    public isHadGift(row: number, col: number) {
        for (let i = 0; i < this.giftList.length; i++) {
            let giftPrefab: GiftPrefab = this.giftList[i];
            if (!giftPrefab.giftModel.isOpen && giftPrefab.giftModel.row == row && giftPrefab.giftModel.col == col) {
                return true;
            }
        }
    }

    /**
     * 当前行列是否可以给角色行走
     * @param row 
     * @param col 
     */
    public canWalk(row: number, col: number){
        for (let i = 0; i < this.giftList.length; i++) {
            let giftPrefab: GiftPrefab = this.giftList[i];
            if (giftPrefab.node.active && giftPrefab.giftModel.row == row && giftPrefab.giftModel.col == col) {
                return false;
            }
        }
        return true
    }


    /**
     * 获取当前行列的宝箱
     * @param row 
     * @param col 
     */
    public getGift(row: number, col: number): GiftPrefab {
        for (let i = 0; i < this.giftList.length; i++) {
            let giftPrefab: GiftPrefab = this.giftList[i];
            if (!giftPrefab.giftModel.isOpen && giftPrefab.giftModel.row == row && giftPrefab.giftModel.col == col) {
                return giftPrefab;
            }
        }
    }

    onDestroy() {
        GiftManager.instatnce = null;
    }
}