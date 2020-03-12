import WheelPrefab from "./WheelPrefab";
import EventManager from "../../engine/utils/EventManager";
import GameEvent from "../config/GameEvent";
import { Logger } from "../../engine/utils/Logger";
import MaterialConfig from "../config/MaterialConfig";
import MaterialPrefab from "./MaterialPrefab";
import MagicPrefab from "./MagicPrefab";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MagicOperateWheelPrefab extends WheelPrefab {

    @property({type:cc.Prefab})
    private wheelItemPrefab:cc.Prefab = null;

    protected onLoad() {
        super.onLoad();
    }


    public initMaterial(magicList:Array<number>){
        this.node.removeAllChildren()
        this.wheelItems = [];
        for(let i=0; i<magicList.length; i++){
            let itemNode:cc.Node = cc.instantiate(this.wheelItemPrefab)
            this.wheelItems[i] = itemNode;
            this.node.addChild(itemNode)
            itemNode.getChildByName("view").getComponent(cc.Sprite).spriteFrame = MagicPrefab.getMagicView(magicList[i]);
        }
        this.initWheelRot(true)
        
    }

    protected onSelectWheel(index: number) {
        Logger.log(this,"MagicOperateWheelPrefab===index===", index)
        EventManager.instance.dispatchEvent(GameEvent.Event_Player_Magic_Action, index)
    }

    protected onDestroy() {
        super.onDestroy();
    }

}
