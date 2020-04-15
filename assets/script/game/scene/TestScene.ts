
import SceneBase from "./SceneBase";
import MathUtils from "../../engine/utils/MathUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestScene extends SceneBase {



    onLoadMe() {
        cc.debug.setDisplayStats(false);
        cc.dynamicAtlasManager.enabled = false;

    }

  
    p

    onDestroyMe() {
        this.unscheduleAllCallbacks();
    }

}
