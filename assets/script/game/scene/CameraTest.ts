import { Logger } from "../../engine/utils/Logger";

const { ccclass, property } = cc._decorator;


// camera z value should between camera nearClip and farClip
const MINI_CAMERA_Z = 100;


@ccclass
export default class CameraTest extends cc.Component {

    @property(cc.Node)
    private target: cc.Node = null;


    @property(cc.Camera)
    private miniMapCamera: cc.Camera = null;


    @property(cc.Graphics)
    private cameraInfo: cc.Graphics = null;

    private cameraPos: cc.Vec3 = cc.v3(0, 0, MINI_CAMERA_Z);
    private cameraOrthoSize: number = 100;

    private _tweens: cc.Tween[] = [];




    start() {

        let t = cc.tween(this.target)
            .by(6, { angle: 360 })
            .repeatForever()
            .start()
        this._tweens.push(t);


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

        this.cameraPos = cc.v3(150,50,100);
    }


    update() {

        let { width: canvasWidth, height: canvasHeight } = cc.Canvas.instance.node;

        let deviceWidth = canvasWidth, deviceHeight = canvasHeight;


        let orthoHeight = this.cameraOrthoSize;
        let orthoWidth = orthoHeight * (deviceWidth / deviceHeight);

        let rect = this.miniMapCamera.rect;
        this.cameraInfo.clear();
        // Logger.log("update=", this.cameraOrthoSize, orthoWidth, orthoHeight, rect, this.cameraPos)
        // draw mini camera border
        // draw mini camera border
        let yellowX: number = (rect.x - 0.5) * deviceWidth;
        let yellowY: number = (rect.y - 0.5) * deviceHeight;
        // Logger.log("update=", deviceWidth, deviceHeight, rect, yellowX, yellowY, rect.width * deviceWidth, rect.height * deviceHeight)


        this.cameraInfo.rect(yellowX, yellowY, rect.width * deviceWidth, rect.height * deviceHeight);
        this.cameraInfo.strokeColor = cc.Color.YELLOW;
        this.cameraInfo.stroke();

        Logger.log("update=", this.cameraPos, orthoWidth, orthoHeight)
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
