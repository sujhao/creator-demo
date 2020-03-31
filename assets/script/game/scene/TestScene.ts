
import SceneBase from "./SceneBase";
import MathUtils from "../../engine/utils/MathUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestScene extends SceneBase {

    @property(cc.Camera)
    camera: cc.Camera = null;

    @property([cc.Sprite])
    sp_cameras: cc.Sprite[] = [];

    @property(cc.Node)
    node_icon: cc.Node = null;


    onLoadMe() {
        cc.debug.setDisplayStats(false);

        const texture = new cc.RenderTexture();
        this.sp_cameras.forEach((v) => {
            v.node.width = this.node_icon.width;
            v.node.height = this.node_icon.height;
        })
        texture.initWithSize(this.node_icon.width, this.node_icon.height);
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        this.camera.targetTexture = texture;
        this.sp_cameras.forEach((v) => {
            v.spriteFrame = spriteFrame
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onNodeIconTouchMove, this);
        this.schedule(this.shadowFollow, 0.1, cc.macro.REPEAT_FOREVER);
    }

    private onNodeIconTouchMove(evt: cc.Event.EventTouch) {
        this.node_icon.x += evt.getDeltaX();
        this.node_icon.y += evt.getDeltaY();
    }

    private shadowFollow() {
        // this.sp_cameras.forEach((v, i) => {
        //     const dis = this.node.position.sub(v.node.position).mag();
        //     // const dis:number = MathUtils.distance(v.node.position.x, v.node.position.y, this.node_icon.x, this.node_icon.y)
        //     if (dis > 1) {
        //         // console.log("dis===", dis)
        //         v.node.active = true;
        //         v.node.stopAllActions();
        //         cc.tween(v.node).to(i * 0.05 + 0.02, {position: cc.v2(this.node_icon.x, this.node_icon.y)}).call(()=>{
        //             // console.log("到达===")
        //             v.node.stopAllActions();
        //             v.node.active = false;
        //         }).start()
        //         // v.node.runAction(cc.moveTo(i * 0.05 + 0.02, this.node_icon.x, this.node_icon.y));
        //     }
        // })
    }



    onDestroyMe() {
        this.unscheduleAllCallbacks();
    }

}
