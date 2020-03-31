import { Logger } from "../utils/Logger";
import MathUtils from "../utils/MathUtils";


const { ccclass, property } = cc._decorator;
// camera z value should between camera nearClip and farClip
const MINI_CAMERA_Z = 100;

@ccclass
export default class CameraShadow extends cc.Component {

    @property({ type: cc.Node })
    private targetNode: cc.Node = null;

    // @property(cc.Sprite)
    // private renderTextureSprite: cc.Sprite = null;

    @property(cc.Camera)
    private showCamera: cc.Camera = null;


    private shadowSpriteList: Array<cc.Sprite> = [];


    private renderTexture: cc.RenderTexture = new cc.RenderTexture();
    private cameraPos: cc.Vec3 = cc.v3(0, 0, MINI_CAMERA_Z);
    private cameraOrthoSize: number; //


    private spriteNum: number = 5;
    
    private tweens: cc.Tween[] = [];

    onLoad() {
        cc.debug.setDisplayStats(false);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onNodeIconTouchMove, this);
        Logger.log("zIndex=", this.targetNode.zIndex)
    }

    start() {
        this.initRenderTexture();
        this.schedule(this.shadowFollow, 0.1, cc.macro.REPEAT_FOREVER);
    }


    private initRenderTexture() {
        this.renderTexture.initWithSize(this.targetNode.width, this.targetNode.height);
        this.showCamera.targetTexture = this.renderTexture;
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(this.renderTexture);

        for (let i = 0; i < this.spriteNum; i++) {
            let tempNode: cc.Node = new cc.Node();
            this.shadowSpriteList[i] = tempNode.addComponent(cc.Sprite);
            this.targetNode.parent.addChild(tempNode);
            tempNode.zIndex = this.targetNode.zIndex - i - 1;
            this.shadowSpriteList[i].spriteFrame = spriteFrame;
            this.shadowSpriteList[i].node.width = this.targetNode.width;
            this.shadowSpriteList[i].node.height = this.targetNode.height;
            this.shadowSpriteList[i].node.scaleX = this.targetNode.scaleX;
            this.shadowSpriteList[i].node.scaleY = -1 * this.targetNode.scaleY;
        }
        Logger.log("shadowSpriteList=", this.shadowSpriteList)
    }

    private onNodeIconTouchMove(evt: cc.Event.EventTouch) {
        this.targetNode.x += evt.getDeltaX();
        this.targetNode.y += evt.getDeltaY();
    }

    private shadowFollow(){
        for (let i = 0; i < this.shadowSpriteList.length; i++) {
            let shadowSprite: cc.Sprite = this.shadowSpriteList[i];
            const dis: number = MathUtils.distance(this.targetNode.x, this.targetNode.y, shadowSprite.node.x, shadowSprite.node.y);
            Logger.log("dis==", dis)
            if (dis > 1) {
                shadowSprite.node.active = true;
                shadowSprite.node.stopAllActions();
                let t = cc.tween(shadowSprite.node).to(i*0.05+0.02,  { position: this.targetNode.getPosition()}).call(()=>{
                    shadowSprite.node.stopAllActions();
                    shadowSprite.node.active = false;
                }).start();
                this.tweens.push(t);
            }
        }

    }

    update() {
        this.cameraPos = cc.v3(this.targetNode.x, this.targetNode.y, MINI_CAMERA_Z)
        this.cameraOrthoSize = Math.ceil(this.targetNode.height / 2);
        this.showCamera.node.position = this.cameraPos;
        this.showCamera.orthoSize = this.cameraOrthoSize;
    }

    onDestroy() {
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
        this.tweens.forEach(t => {
            t.stop();
        })
    }

}
