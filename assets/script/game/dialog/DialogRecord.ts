import DialogBase from "../../engine/uicomponent/DialogBase";
import PrefabLoader from "../../engine/utils/PrefabLoader";
import RecordModel from "../model/RecordModel";
import EventManager, { HaoEvent } from "../../engine/utils/EventManager";
import { Logger } from "../../engine/utils/Logger";
import ControlUI, { ControlUI_Event } from "../prefab/ControlUI";
import GameEvent from "../config/GameEvent";
import BagModel from "../model/BagModel";
import PlayerInfo from "../model/PlayerInfo";
import LevelInfo from "../model/LevelInfo";
import SceneManager from "../scene/SceneManager";

const { ccclass, property } = cc._decorator;


@ccclass
export default class DialogRecord extends DialogBase {

    private static ScriptName: string = "DialogRecord";

    @property({ type: [cc.Node] })
    private itemList: Array<cc.Node> = [];

    @property({ type: [cc.Node] })
    private btncloseList: Array<cc.Node> = [];

    @property({ type: cc.Node })
    private fingerNode: cc.Node = null;

    private tabYConfig: Array<number> = [
        38.716, -49.284, -135.284, -215.284
    ];

    private curIndex: number = 0;

    public isLoadRecord:boolean = false; //是否加载旧进度

    onLoadMe() {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        this.init();
    }


    private init() {
        this.fingerNode.setPosition(this.fingerNode.x, this.tabYConfig[this.curIndex])
        RecordModel.initAll();
        this.refresh();
    }

    /**
     * 刷新玩家记录
     */
    private refresh(){
        for (let i = 0; i < this.itemList.length; i++) {
            let record: RecordModel = RecordModel.recordList[i];
            let txtCheckPoint: cc.Node = this.itemList[i].getChildByName("txtCheckPoint");
            let txtName: cc.Node = this.itemList[i].getChildByName("txtName");
            let txtPlayerLevel: cc.Node = this.itemList[i].getChildByName("txtPlayerLevel");
            if (record) {
                this.btncloseList[i].active = true;
                txtCheckPoint.active = true;
                txtCheckPoint.getComponent(cc.Label).string = record.level + ""
                txtName.active = true;
                txtName.getComponent(cc.Label).string = record.getPlayerName();
                txtPlayerLevel.active = true;
                txtPlayerLevel.getComponent(cc.Label).string = record.getPlayerLevel() + "";
                this.btncloseList[i].active = true;
                EventManager.instance.addBtnEvent(this.node, this.btncloseList[i], DialogRecord.ScriptName, "onClickDelete", i)
            } else {
                this.btncloseList[i].active = false;
                txtCheckPoint.active = false;
                txtName.active = false;
                txtPlayerLevel.active = false;
                this.btncloseList[i].active = false;
            }
        }

    }

    /**
     * 点击删除改行记录
     * @param event 
     * @param index 
     */
    private onClickDelete(event, index: number) {
        Logger.log(this,"onClickDelete===", event, index)
        RecordModel.deleteLocalStoryage(index)
        this.refresh();
    }

    /**
    * 控制UI事件
    * @param keyType 
    */
    private onControlUIEvent(event:HaoEvent,keyType: number) {
        if(!this.node.active)return
        if (keyType == ControlUI_Event.Up) {
            if (this.curIndex > 0) {
                this.curIndex--;
                cc.tween(this.fingerNode).to(0.1, { position: cc.v2(this.fingerNode.x, this.tabYConfig[this.curIndex]) }).start()
            }
        } else if (keyType == ControlUI_Event.Down) {
            if (this.curIndex < this.tabYConfig.length - 1) {
                this.curIndex++;
                cc.tween(this.fingerNode).to(0.1, { position: cc.v2(this.fingerNode.x, this.tabYConfig[this.curIndex]) }).start()
            }
        }else if(keyType == ControlUI_Event.A){
            this.saveRecord(null, this.curIndex);
        }else if(keyType == ControlUI_Event.B){
            EventManager.instance.dispatchEvent(GameEvent.Event_Book_Back_Main);
        }
    }

    /**
     * 点击改行记录
     * @param event 
     * @param index 
     */
    private saveRecord(event, index:number){
        if(this.isLoadRecord){ //加载旧进度
            let recordModel:RecordModel = RecordModel.recordList[index];
            PlayerInfo.modelList = recordModel.playerInfoList;
            BagModel.modelList = recordModel.bagModelList;
            LevelInfo.nowLevel = recordModel.level;
        }else{
            RecordModel.saveToLocaleStorage(index)
            this.refresh();
        }
    }

    onDestroyMe() {
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }

    public static show(parentNode: cc.Node = null) {
        PrefabLoader.loadPrefab("game/dialog/" + this.ScriptName, (loadedResource: cc.Prefab) => {
            if (!parentNode) {
                parentNode = cc.Canvas.instance.node;
            }
            let node: cc.Node = cc.instantiate(loadedResource);
            parentNode.addChild(node);
            node.setPosition(0, 0)
        });
    }

}