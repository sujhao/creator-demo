import SceneBase from "./SceneBase";
import SceneManager from "./SceneManager";
import StartScene from "./StartScene";
import EventManager from "../../engine/utils/EventManager";
import GameEvent from "../config/GameEvent";
import DialogRecord from "../dialog/DialogRecord";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecordScene extends SceneBase {

    public static scriptName: string = "RecordScene";

    @property({type:cc.Node})
    private recordNode:cc.Node = null;


    onLoadMe(){
        EventManager.instance.addListener(GameEvent.Event_Book_Back_Main, this.onClickExit, this);
        this.recordNode.getComponent(DialogRecord).isLoadRecord = true;
    }

    private onClickExit(){
        SceneManager.instance.sceneSwitch(StartScene.scriptName);
    }

    onDestroyMe(){
        EventManager.instance.removeListener(GameEvent.Event_Book_Back_Main, this.onClickExit);
    }
}