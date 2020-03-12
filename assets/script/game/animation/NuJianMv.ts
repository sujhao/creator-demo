import MathUtils from "../../engine/utils/MathUtils";
import { Logger } from "../../engine/utils/Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NuJianMv extends cc.Component {

    @property({ type: [cc.Node] })
    private jianList: Array<cc.Node> = [];

    private radius: number = 30;

    private initP: cc.Vec2;

    private targetP: cc.Vec2;

    private callback: Function;

    start() {
        this.play();
    }

    private hideAll() {
        for (let i = 0; i < this.jianList.length; i++) {
            this.jianList[i].active = false;
        }
    }

    public play(initP: cc.Vec2 = cc.v2(-257.614, -67.204), targetP: cc.Vec2 = cc.v2(239.944, -96.997), callback: Function = null) {
        this.initP = initP;
        this.targetP = targetP;
        this.callback = callback;
        this.hideAll();
        this.showJian(0)
    }

    private showJian(index: number) {
        if (index < this.jianList.length) {
            let degress: number = -45 * index;
            this.jianList[index].angle = degress;
            let rad: number = MathUtils.degreesToRadians(degress);
            this.jianList[index].x = this.initP.x + this.radius * Math.cos(rad)
            this.jianList[index].y = this.initP.y + this.radius * Math.sin(rad)
            this.jianList[index].active = true;
            this.scheduleOnce(() => {
                index++;
                this.showJian(index)
            }, 0.2)
        } else {
            this.showFly(0)
        }
    }

    private showFly(index: number) {
        if (index < this.jianList.length) {
            let rad: number = Math.atan2(this.targetP.y - this.initP.y, this.targetP.x - this.initP.x);
            let degress: number = MathUtils.radiansToDegrees(rad);
            this.jianList[index].angle = degress;
            let tempNode: cc.Node = this.jianList[index];
            cc.tween(this.node).to(0.2, { position: this.targetP }).call(() => {
                tempNode.active = false;
            }).start()
            this.scheduleOnce(() => {
                index++;
                this.showFly(index)
            }, 0.2)
        } else {
            if (this.callback) {
                this.callback();
            }
        }
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
    }
}
