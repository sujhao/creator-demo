import { Logger } from "../utils/Logger";
import EventManager from "../utils/EventManager";
import CommonEvent from "../config/CommonEvent";
import DateUtil from "../utils/DateUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SingleInstanceNode extends cc.Component {

    public static instance: SingleInstanceNode;

    private preTime: number = 0;
    private frameCount: number = 0;

    public static fps:number = 0;

    onLoad() {
        SingleInstanceNode.instance = this.node.getComponent(SingleInstanceNode);
        cc.game.addPersistRootNode(this.node);
    }

    update(dt) {
        this.checkFps();
    }
    
    private checkFps() {
        let now: number = DateUtil.now();
        EventManager.instance.dispatchEvent(CommonEvent.Event_FrameUpdate, now);
        if (this.preTime == 0) {
            this.preTime = now;
        } else {
            this.frameCount ++;
            let pass: number = now - this.preTime;
            if (pass >= 1000) {
                SingleInstanceNode.fps = this.frameCount;
                this.preTime = now;
                this.frameCount = 0;
            }
        }
    }
}
