import MathUtils from "../../engine/utils/MathUtils";
import { Logger } from "../../engine/utils/Logger";
import ShaderHelper from "../../engine/utils/ShaderHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class YuJianMv extends cc.Component {

    @property({type:cc.Node})
    private jian:cc.Node = null;

    private initP: cc.Vec2;

    private targetP: cc.Vec2;

    private callback: Function;

    private rotationTween:cc.Tween;

    start() {
        this.play();
    }

  
    public play(initP: cc.Vec2 = cc.v2(-257.614, -67.204), targetP: cc.Vec2 = cc.v2(239.944, -96.997), callback: Function = null) {
        this.initP = initP;
        this.targetP = targetP;
        this.callback = callback;
        // this.showJian(0)
        this.rotationTween =  cc.tween(this.jian)
        .repeatForever(
            cc.tween().by(0.7, { angle: -360 })
        ).start()
        this.jian.setPosition(initP);
        ShaderHelper.setCommonGlowInner(this.jian, cc.Color.YELLOW)
        cc.tween(this.jian).to(2, { position: cc.v2(initP.x, initP.y+200) }).call(()=>{
            this.jian.rotation = 0;
            this.rotationTween.stop();
        }).to(0.5, { position: targetP }).call(() => {
            ShaderHelper.clearAllEffect(this.jian)
        }).start()
    }


    onDestroy() {
        this.unscheduleAllCallbacks();
    }

}
