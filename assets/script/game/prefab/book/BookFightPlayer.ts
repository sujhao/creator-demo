import LevelFightPlayer from "../../model/LevelFightPlayer";
import LevelInfo from "../../model/LevelInfo";
import PlayerInfo from "../../model/PlayerInfo";
import PlayerResourcePrefab from "../PlayerResourcePrefab";
import PlayerBase from "../../players/PlayerBase";
import { PlayerSide } from "../../model/PlayerType";
import ShaderHelper from "../../../engine/utils/ShaderHelper";
import EventManager, { HaoEvent } from "../../../engine/utils/EventManager";
import ControlUI, { ControlUI_Event } from "../ControlUI";
import GameEvent from "../../config/GameEvent";
import CommonTips from "../../../engine/uicomponent/CommonTips";
import { Logger } from "../../../engine/utils/Logger";
import SceneManager from "../../scene/SceneManager";
import LevelConfig from "../../model/LevelConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BookFightPlayer extends cc.Component {

    @property({ type: cc.Node })
    private fingle: cc.Node = null;

    @property({ type: cc.ScrollView })
    private scrollView: cc.ScrollView = null;

    @property({ type: cc.Label })
    private txtMaxNum: cc.Label = null;

    @property({ type: cc.Label })
    private txtSelectNum: cc.Label = null;

    private nowLevelFightPlayer: LevelFightPlayer;

    private nowSelectIndex: number = 1;

    private fingleLocation: Array<cc.Vec2> = [
        cc.v2(-157.029, -242.695),
        cc.v2(33.871, -242.695),
    ];

    onLoad() {
        LevelFightPlayer.nowFightPlayers = [];
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        this.nowLevelFightPlayer = LevelFightPlayer.get(LevelInfo.nowLevel);
        this.refresh();
    }

    public initPlayerList() {
        if (LevelFightPlayer.nowFightPlayers.length == 0) {
            for (let i = 0; i < this.nowLevelFightPlayer.mustFightPlayers.length; i++) {
                let playerType: number = this.nowLevelFightPlayer.mustFightPlayers[i];
                let playerInfo: PlayerInfo = PlayerInfo.getPlayerInfoByPlayerType(playerType);
                LevelFightPlayer.nowFightPlayers.push(playerInfo);
            }
        }
        this.txtSelectNum.string = "" + LevelFightPlayer.nowFightPlayers.length;
        this.txtMaxNum.string = "" + this.nowLevelFightPlayer.maxPlayerNum;
        Logger.log(this,"nowFightPlayers===", LevelFightPlayer.nowFightPlayers)
        this.scrollView.content.removeAllChildren();
        for (let i = 0; i < LevelFightPlayer.nowFightPlayers.length; i++) {
            let model: PlayerInfo = LevelFightPlayer.nowFightPlayers[i];
            if (model) {
                let playerPrefab: cc.Prefab = PlayerResourcePrefab.getPlayerPrefab(model.playerType);
                let playerNode: cc.Node = cc.instantiate(playerPrefab);
                this.scrollView.content.addChild(playerNode)
                playerNode.getComponent(PlayerBase).setSide(PlayerSide.Down)
            }
        }
        this.refresh();
    }

    private refresh() {
        this.fingle.setPosition(this.fingleLocation[this.nowSelectIndex])
    }

    private onControlUIEvent(event:HaoEvent,keyType: number) {
        if (!this.node.active) {
            return;
        }
        event.isStop = true;
        if (keyType == ControlUI_Event.B) {
            EventManager.instance.dispatchEvent(GameEvent.Event_Book_Back_Main);
        } else if (keyType == ControlUI_Event.A) {
            if(this.nowSelectIndex == 1){
                EventManager.instance.dispatchEvent(GameEvent.Event_Book_Back_Main);
            }else{
                SceneManager.instance.sceneSwitch(LevelConfig.sceneConfig[LevelInfo.nowLevel-1])
            }
        }
        else if (keyType == ControlUI_Event.Left || keyType == ControlUI_Event.Up) {
            if (this.nowSelectIndex > 0) {
                this.nowSelectIndex--;
                this.refresh()
            }
        } else if (keyType == ControlUI_Event.Right || keyType == ControlUI_Event.Down) {
            if (this.nowSelectIndex < this.fingleLocation.length-1) {
                this.nowSelectIndex++;
                this.refresh()
            }
        }
    }

    onDestroy() {
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }

}
