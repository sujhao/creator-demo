import EventManager, { HaoEvent } from "../../../engine/utils/EventManager";
import ControlUI, { ControlUI_Event } from "../ControlUI";
import GameEvent from "../../config/GameEvent";
import { Logger } from "../../../engine/utils/Logger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BookMain extends cc.Component {


    @property({ type: cc.Node })
    private fingerNode: cc.Node = null;


    private nowTabIndex: number = 0;

    private fingerPList: Array<cc.Vec2> = [
        cc.v2(-239.659, 174.404),
        cc.v2(-239.659, 89.404),
        cc.v2(-239.659, 9.404),
        cc.v2(-239.659, -68.596),
        cc.v2(-239.659, -139.596),
        cc.v2(-239.659, -220.596),
    ];

    onLoad () {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        this.reInit();
    }


    private reInit() {
        this.nowTabIndex = 0;
        this.fingerNode.setPosition(this.fingerPList[this.nowTabIndex])
    }


    private onControlUIEvent(event:HaoEvent,keyType: number) {
        Logger.log(this, event)
        if(!this.node.active){
            return;
        }
        if(keyType == ControlUI_Event.A){
            EventManager.instance.dispatchEvent(GameEvent.Event_Book_Select_Main, this.nowTabIndex);
        }
        else if (keyType == ControlUI_Event.Down) {
            if (this.nowTabIndex < this.fingerPList.length - 1) {
                this.nowTabIndex += 1;
                cc.tween(this.fingerNode).to(0.05, { position: this.fingerPList[this.nowTabIndex] }).start()
            }
        } else if (keyType == ControlUI_Event.Up) {
            if (this.nowTabIndex > 0) {
                this.nowTabIndex -= 1;
                cc.tween(this.fingerNode).to(0.05, { position: this.fingerPList[this.nowTabIndex] }).start()
            }
        }
    }

    onDestroy(){
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }
}
