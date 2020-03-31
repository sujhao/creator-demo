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
    private cameraOrthoSize: number = Math.ceil(295/2);

    private _tweens: cc.Tween[] = [];



    private _renderTexture: cc.RenderTexture = new cc.RenderTexture();

    start() {

        cc.debug.setDisplayStats(false);
        // let t = cc.tween(this.target)
        //     .by(6, { angle: 360 })
        //     .repeatForever()
        //     .start()
        // this._tweens.push(t);


        Logger.log("height==", cc.Canvas.instance.node.height)

        // t = cc.tween(this)
        //     .set({ cameraPos: cc.v3(0, 0, MINI_CAMERA_Z), cameraOrthoSize: cc.Canvas.instance.node.height / 2 })
        //     .to(6, { cameraOrthoSize: this.target.width / 2 })
        //     .delay(1)
        //     .to(3, { cameraPos: cc.v3(100, 0, MINI_CAMERA_Z) })
        //     .union()
        //     .repeatForever()
        //     .start()
        // this._tweens.push(t);

        this.cameraPos = cc.v3(0, 0, MINI_CAMERA_Z);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onNodeIconTouchMove, this);
        this.initRenderTexture();
    }
    // onEnable () {
    //     cc.view.on('design-resolution-changed', this._delayInitRenderTexture, this);
    // }
    // _delayInitRenderTexture () {
    //     // should calculate size after canvas updated
    //     this.scheduleOnce(this.initRenderTexture.bind(this), 0.1);
    // }

    private initRenderTexture () {
        let { width: canvasWidth, height: canvasHeight } = cc.Canvas.instance.node;
        let cameraWidth: number = this.miniMapCamera.rect.width * canvasWidth;
        let cameraHeight: number = this.miniMapCamera.rect.height * canvasHeight;
        Logger.log("initRenderTexture==",this.miniMapCamera.rect.width, this.miniMapCamera.rect.height, cameraWidth, cameraHeight)
        // this._renderTexture.initWithSize(cameraWidth, cameraHeight);
        let tempWidth:number = 500;
        let tempHeight:number = 295;
        this._renderTexture.initWithSize(tempWidth,tempHeight);
        this.miniMapCamera.targetTexture = this._renderTexture;

        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(this._renderTexture);
        this.renderTextureSprite.spriteFrame = spriteFrame;
        this.renderTextureSprite.node.width = tempWidth;
        this.renderTextureSprite.node.height = tempHeight;
        
    }

    private onNodeIconTouchMove(evt: cc.Event.EventTouch) {
        this.target.x += evt.getDeltaX();
        this.target.y += evt.getDeltaY();
    }


    update() {

        this.cameraPos = cc.v3(this.target.x, this.target.y, MINI_CAMERA_Z)
        let { width: canvasWidth, height: canvasHeight } = cc.Canvas.instance.node;

        let deviceWidth = canvasWidth, deviceHeight = canvasHeight;


        let orthoHeight = this.cameraOrthoSize;
        let orthoWidth = orthoHeight * (deviceWidth / deviceHeight);

        let cameraWidth: number = this.miniMapCamera.rect.width * deviceWidth;
        let afd = 1 - (deviceWidth / 2 - this.cameraPos.x + cameraWidth / 2) / deviceWidth;

        // Logger.log("afd==", afd, cameraWidth);
        // this.miniMapCamera.rect.x = afd
        // let rect = this.miniMapCamera.rect;
        // this.miniMapCamera.rect = cc.rect(afd, rect.y, rect.width,rect.height)

        this.cameraInfo.clear();
        // Logger.log("update=", this.cameraOrthoSize, orthoWidth, orthoHeight, rect, this.cameraPos)
        // draw mini camera border
        // draw mini camera border
        // let yellowX: number = (rect.x - 0.5) * deviceWidth;
        // let yellowY: number = (rect.y - 0.5) * deviceHeight;
        // Logger.log("update=", deviceWidth, deviceHeight, rect, yellowX, yellowY, rect.width * deviceWidth, rect.height * deviceHeight)


        // this.cameraInfo.rect(yellowX, yellowY, rect.width * deviceWidth, rect.height * deviceHeight);
        // this.cameraInfo.strokeColor = cc.Color.YELLOW;
        // this.cameraInfo.stroke();

        let renderTextureNode = this.renderTextureSprite.node;
        this.cameraInfo.rect(renderTextureNode.x - renderTextureNode.width/2, renderTextureNode.y - renderTextureNode.height/2, renderTextureNode.width, renderTextureNode.height);
        this.cameraInfo.strokeColor = cc.Color.YELLOW;
        this.cameraInfo.stroke();


        // Logger.log("update=", this.cameraPos, orthoWidth, orthoHeight)
        // draw mini camera ortho size
        this.cameraInfo.rect(this.cameraPos.x - orthoWidth, this.cameraPos.y - orthoHeight, orthoWidth * 2, orthoHeight * 2);
        this.cameraInfo.strokeColor = cc.Color.BLUE;
        this.cameraInfo.stroke();


        this.miniMapCamera.node.position = this.cameraPos;
        this.miniMapCamera.orthoSize = this.cameraOrthoSize;
    }

    onDestroy() {
        this._tweens.forEach(t => {
            t.stop();
        })
    }


}
