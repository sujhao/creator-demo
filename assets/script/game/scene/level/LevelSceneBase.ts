import SceneBase from "../SceneBase";
import GiftManager from "../../manager/GiftManager";
import PlayerManager from "../../players/PlayerManager";
import TileMapBase from "../../tilemap/TileMapBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelSceneBase extends SceneBase {

    onLoad() {
        super.onLoad();
    }

    start() {
        this.init();
        super.start();
    }

    /**
     * 当前关卡通用的初始化工作
     */
    private init() {
        TileMapBase.instatnce.init();
        PlayerManager.instatnce.init();
        GiftManager.instatnce.init();
    }

    onDestroy() {
        super.onDestroy();
    }

}