import { Logger } from "../../engine/utils/Logger";

const { ccclass, property } = cc._decorator;


// camera z value should between camera nearClip and farClip
const MINI_CAMERA_Z = 100;


@ccclass
export default class CameraSprite extends cc.Component {

    @property(cc.Node)
    private target: cc.Node = null;


    @property(cc.Camera)
    private miniMapCamera: cc.Camera = null;


    @property(cc.Graphics)
    private cameraInfo: cc.Graphics = null;


    @property(cc.Sprite)
    renderTextureSprite: cc.Sprite = null;


    private cameraPos: cc.Vec3 = cc.v3(0, 0, MINI_CAMERA_Z);
    private cameraOrthoSize: number;


    private PicWidth: number = 500;

    private PicHeight: number = 295;

    private _renderTexture: cc.RenderTexture = new cc.RenderTexture();

    start() {
        cc.debug.setDisplayStats(false);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onNodeIconTouchMove, this);
        this.initRenderTexture();
    }

    private initRenderTexture() {

        this.PicWidth = this.target.width;
        this.PicHeight = this.target.height;

        this._renderTexture.initWithSize(this.PicWidth, this.PicHeight);
        this.miniMapCamera.targetTexture = this._renderTexture;
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(this._renderTexture);
        this.renderTextureSprite.spriteFrame = spriteFrame;
        this.renderTextureSprite.node.width = this.PicWidth;
        this.renderTextureSprite.node.height = this.PicHeight;
    }

    private onNodeIconTouchMove(evt: cc.Event.EventTouch) {
        this.target.x += evt.getDeltaX();
        this.target.y += evt.getDeltaY();
    }

    update() {
        this.cameraPos = cc.v3(this.target.x, this.target.y, MINI_CAMERA_Z)

        this.cameraOrthoSize =  Math.ceil(this.target.height / 2);
        let deviceWidth: number = cc.Canvas.instance.node.width;
        let deviceHeight: number = cc.Canvas.instance.node.height;
        let orthoHeight:number = this.cameraOrthoSize;
        let orthoWidth = orthoHeight * (deviceWidth / deviceHeight);
        if(orthoWidth < this.target.width/2){
            // orthoWidth = this.target.width/2;
            // this.cameraOrthoSize = orthoWidth*deviceHeight/deviceWidth;
            // orthoHeight = this.cameraOrthoSize;
        }
        this.cameraInfo.clear();

        let renderTextureNode = this.renderTextureSprite.node;
        this.cameraInfo.rect(renderTextureNode.x - renderTextureNode.width / 2, renderTextureNode.y - renderTextureNode.height / 2, renderTextureNode.width, renderTextureNode.height);
        this.cameraInfo.strokeColor = cc.Color.YELLOW;
        this.cameraInfo.stroke();

        this.cameraInfo.rect(this.cameraPos.x - orthoWidth, this.cameraPos.y - orthoHeight, orthoWidth * 2, orthoHeight * 2);
        this.cameraInfo.strokeColor = cc.Color.BLUE;
        this.cameraInfo.stroke();


        this.miniMapCamera.node.position = this.cameraPos;
        this.miniMapCamera.orthoSize = this.cameraOrthoSize;


        // [2020-3-31 19:27:53:838] [HaoJslog] [log]  orthoWidth= 373.5 210.09375
        Logger.log("orthoWidth=", orthoWidth, this.cameraOrthoSize)
    }

    onDestroy() {

    }


}
