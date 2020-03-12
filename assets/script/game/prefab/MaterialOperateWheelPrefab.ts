import WheelPrefab from "./WheelPrefab";
import EventManager from "../../engine/utils/EventManager";
import GameEvent from "../config/GameEvent";
import { Logger } from "../../engine/utils/Logger";
import MaterialConfig from "../config/MaterialConfig";
import MaterialPrefab from "./MaterialPrefab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MaterialOperateWheelPrefab extends WheelPrefab {

    @property({ type: cc.Prefab })
    private wheelItemPrefab: cc.Prefab = null;

    protected onLoad() {
        super.onLoad();
    }


    public initMaterial(materialList: Array<number>) {
        this.node.removeAllChildren()
        this.wheelItems = [];
        for (let i = 0; i < materialList.length; i++) {
            let itemNode: cc.Node = cc.instantiate(this.wheelItemPrefab)
            this.wheelItems[i] = itemNode;
            this.node.addChild(itemNode)
            itemNode.getChildByName("view").getComponent(cc.Sprite).spriteFrame = MaterialPrefab.getMaterialView(materialList[i]);
        }
        this.initWheelRot(true)
    }

    protected onSelectWheel(index: number) {
        Logger.log(this, "MaterialOperateWheelPrefab===index===", index)
        EventManager.instance.dispatchEvent(GameEvent.Event_Player_Material_Action, index)
    }

    protected onDestroy() {
        super.onDestroy();
    }

}
