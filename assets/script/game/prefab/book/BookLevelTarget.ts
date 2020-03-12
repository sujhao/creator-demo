import EventManager, { HaoEvent } from "../../../engine/utils/EventManager";
import ControlUI, { ControlUI_Event } from "../ControlUI";
import LevelTarget from "../../model/LevelTarget";
import LevelInfo from "../../model/LevelInfo";
import GameEvent from "../../config/GameEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BookLevelTarget extends cc.Component {

    @property({type:cc.Label})
    private txtWin:cc.Label = null;
    
    @property({type:cc.Label})
    private txtLost:cc.Label = null;

    @property({type:cc.Label})
    private txtName:cc.Label = null;

    onLoad () {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        this.reInit();
    }


    private reInit() {
        let levelTarget:LevelTarget = LevelTarget.getLevelTarget(LevelInfo.nowLevel);
        this.txtWin.string = levelTarget.win;
        this.txtLost.string = levelTarget.lose;
        this.txtName.string = levelTarget.name;
    }

    private onControlUIEvent(event:HaoEvent,keyType: number) {
        if(!this.node.active){
            return;
        }
        if(keyType == ControlUI_Event.B){
            EventManager.instance.dispatchEvent(GameEvent.Event_Book_Back_Main);
        }
    }

    onDestroy(){
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }
}
