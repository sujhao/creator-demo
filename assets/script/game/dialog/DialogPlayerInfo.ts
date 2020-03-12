import DialogBase from "../../engine/uicomponent/DialogBase";
import PrefabLoader from "../../engine/utils/PrefabLoader";
import LevelInfo from "../model/LevelInfo";
import { GameState } from "../model/GameState";
import ControlUI, { ControlUI_Event } from "../prefab/ControlUI";
import PlayerBase from "../players/PlayerBase";
import EventManager, { HaoEvent } from "../../engine/utils/EventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DialogPlayerInfo extends DialogBase {

    private static ScriptName: string = "DialogPlayerInfo";

    @property({ type: cc.Label })
    private txtName: cc.Label = null;

    @property({ type: cc.Label })
    private txtLevel: cc.Label = null;

    @property({ type: cc.Label })
    private txtExp: cc.Label = null;

    @property({ type: cc.Label })
    private txtLife: cc.Label = null;

    @property({ type: cc.Label })
    private txPower: cc.Label = null;

    @property({ type: cc.Label })
    private txtAttack: cc.Label = null;

    @property({ type: cc.Label })
    private txtDefend: cc.Label = null;

    @property({ type: cc.Label })
    private txtSpeed: cc.Label = null;


    private player: PlayerBase;

    onLoadMe() {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this);
    }

    onStartMe() {
        this.txtName.string = this.player.playerInfo.name;
        this.txtLevel.string = this.player.playerInfo.level + '';
        this.txtExp.string = this.player.playerInfo.exp + "";
        this.txtLife.string = this.player.life + " / " + this.player.playerInfo.life;
        this.txPower.string = this.player.power + " / " + this.player.playerInfo.power;
        this.txtAttack.string = this.player.playerInfo.attack + ""
        this.txtDefend.string = this.player.playerInfo.defend + "";
        this.txtSpeed.string = this.player.playerInfo.speed + "";
    }

    /**
      * 控制UI事件
      * @param keyType 
      */
    private onControlUIEvent(event:HaoEvent, keyType: number) {
        event.isStop = true;
        if (keyType == ControlUI_Event.B) {
            this.node.destroy();
        }
    }
    onDestroyMe() {
        LevelInfo.gameState = GameState.Info;
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent);

    }

    public static show(player: PlayerBase, parentNode: cc.Node = null) {
        PrefabLoader.loadPrefab("game/dialog/" + this.ScriptName, (loadedResource: cc.Prefab) => {
            if (!parentNode) {
                parentNode = cc.Canvas.instance.node;
            }
            let node: cc.Node = cc.instantiate(loadedResource);
            node.getComponent(DialogPlayerInfo).player = player;
            parentNode.addChild(node);
            node.setPosition(0, 0)
        });
    }


}