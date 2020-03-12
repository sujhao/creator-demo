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

const { ccclass, property } = cc._decorator;

@ccclass
export default class BookSelectPlayer extends cc.Component {

    @property({ type: cc.Node })
    private fingle: cc.Node = null;

    @property({ type: cc.ScrollView })
    private scrollView: cc.ScrollView = null;

    @property({ type: cc.Label })
    private txtMaxNum: cc.Label = null;

    @property({ type: cc.Label })
    private txtSelectNum: cc.Label = null;

    @property({ type: cc.Label })
    private txtName: cc.Label = null;

    @property({ type: cc.Label })
    private txtLevel: cc.Label = null;

    @property({ type: cc.Label })
    private txtAttack: cc.Label = null;

    @property({ type: cc.Label })
    private txtLife: cc.Label = null;

    @property({ type: cc.Label })
    private txtDefend: cc.Label = null;

    @property({ type: cc.Label })
    private txtPower: cc.Label = null;

    private nowLevelFightPlayer: LevelFightPlayer;


    private nowSelectIndex: number = 0;
    private startSelectIndex: number = 0;

    private hadSelectPlayers: Array<number> = [];
    private nowPlayerList: Array<cc.Node> = [];

    private fingleLocation: Array<cc.Vec2> = [
        cc.v2(-383.229, 35.575),
        cc.v2(-183.229, 35.575),
        cc.v2(16.771, 35.575),
        cc.v2(216.771, 35.575),
        cc.v2(-383.229, -85.425),
        cc.v2(-183.229, -85.425),
        cc.v2(16.771, -85.425),
        cc.v2(216.771, -85.425),
    ];

    onLoad() {
        LevelFightPlayer.nowFightPlayers = [];
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        this.nowLevelFightPlayer = LevelFightPlayer.get(LevelInfo.nowLevel);
        this.txtMaxNum.string = "" + this.nowLevelFightPlayer.maxPlayerNum;
        this.initPlayerList();
        this.refresh();
    }

    private initPlayerList() {
        this.scrollView.content.removeAllChildren();
        this.nowPlayerList = [];
        for (let i = 0; i < this.fingleLocation.length; i++) {
            let realIndex: number = this.startSelectIndex + i;
            let model: PlayerInfo = PlayerInfo.modelList[realIndex];
            if (model) {
                let playerPrefab: cc.Prefab = PlayerResourcePrefab.getPlayerPrefab(model.playerType);
                let playerNode: cc.Node = cc.instantiate(playerPrefab);
                this.scrollView.content.addChild(playerNode)
                playerNode.getComponent(PlayerBase).setSide(PlayerSide.Down)
                this.nowPlayerList[i] = playerNode;
                if (this.nowLevelFightPlayer.mustFightPlayers.indexOf(model.playerType) != -1) {
                    ShaderHelper.clearAllEffect(playerNode);
                    this.insertSelectPlayer(realIndex)
                } else {
                    ShaderHelper.setGrayEffect(playerNode);
                }
            }
        }
    }

    private insertSelectPlayer(playerIndex: number) {
        let index: number = this.hadSelectPlayers.indexOf(playerIndex);
        if (this.hadSelectPlayers.length < this.nowLevelFightPlayer.maxPlayerNum && index == -1) {
            this.hadSelectPlayers.push(playerIndex);
            LevelFightPlayer.nowFightPlayers.push(PlayerInfo.modelList[playerIndex])
            return true;
        }
    }

    private checkAddOrDelete(playerIndex: number) {
        let index: number = this.hadSelectPlayers.indexOf(playerIndex);
        if (index != -1) {
            if (this.deleteSelectPlayer(playerIndex)) {
                this.refresh();
            }
        } else {
            if (this.insertSelectPlayer(playerIndex)) {
                this.refresh();
            }
        }
    }

    private deleteSelectPlayer(playerIndex: number) {
        let playerInfo: PlayerInfo = PlayerInfo.modelList[playerIndex];
        if (this.nowLevelFightPlayer.mustFightPlayers.indexOf(playerInfo.playerType) != -1) {
            CommonTips.showMsg("必须出场角色")
            return false
        }
        let index: number = this.hadSelectPlayers.indexOf(playerIndex);
        if (index != -1) {
            this.hadSelectPlayers.splice(index, 1)
            LevelFightPlayer.nowFightPlayers.splice(index, 1);
            return true
        }
    }

    private refresh() {
        this.txtSelectNum.string = this.hadSelectPlayers.length + ""
        for (let i = 0; i < this.nowPlayerList.length; i++) {
            let playerNode: cc.Node = this.nowPlayerList[i]
            let realIndex: number = this.startSelectIndex + i;
            if (this.hadSelectPlayers.indexOf(realIndex) != -1) {
                ShaderHelper.clearAllEffect(playerNode);
            } else {
                ShaderHelper.setGrayEffect(playerNode);
            }
        }

        let nowIndex: number = this.startSelectIndex + this.nowSelectIndex;
        let playerInfo: PlayerInfo = PlayerInfo.modelList[nowIndex];
        this.fingle.setPosition(this.fingleLocation[this.nowSelectIndex])
        this.txtName.string = playerInfo.name;
        this.txtLevel.string = playerInfo.level + ""
        this.txtAttack.string = playerInfo.attack + ""
        this.txtDefend.string = playerInfo.defend + ""
        this.txtLife.string = playerInfo.life + "";
        this.txtPower.string = playerInfo.power + ""
    }


    private onControlUIEvent(event:HaoEvent,keyType: number) {
        if (!this.node.active) {
            return;
        }
        if (keyType == ControlUI_Event.B) {
            EventManager.instance.dispatchEvent(GameEvent.Event_Book_Back_Main);
        } else if (keyType == ControlUI_Event.A) {
            this.checkAddOrDelete(this.startSelectIndex + this.nowSelectIndex)
        }
        else if (keyType == ControlUI_Event.Left || keyType == ControlUI_Event.Up) {
            if (this.nowSelectIndex > 0 || this.startSelectIndex > 0) {
                this.nowSelectIndex--;
                if (this.nowSelectIndex < 0) {
                    this.nowSelectIndex = 0;
                    this.startSelectIndex--;
                    this.initPlayerList();
                }
                this.refresh()
            }
        } else if (keyType == ControlUI_Event.Right || keyType == ControlUI_Event.Down) {
            if (this.nowSelectIndex < this.fingleLocation.length || (this.startSelectIndex + this.nowSelectIndex) < PlayerInfo.modelList.length - 1) {
                this.nowSelectIndex++;
                if (this.nowSelectIndex >= this.fingleLocation.length || this.startSelectIndex + this.nowSelectIndex >= PlayerInfo.modelList.length) {
                    this.nowSelectIndex--;
                    if (this.startSelectIndex + this.nowSelectIndex < PlayerInfo.modelList.length - 1) {
                        this.startSelectIndex++;
                        this.initPlayerList();
                    }
                }
                this.refresh()
            }
        }
    }

    onDestroy() {
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }

}
