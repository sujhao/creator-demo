import DialogChat from "../script/game/dialog/DialogChat";
import ShaderHelper from "../script/engine/utils/ShaderHelper";
import { Logger } from "../script/engine/utils/Logger";
import ShaderMaterialPrefab from "../script/game/prefab/ShaderMaterialPrefab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestScene extends cc.Component {

    public static scriptName: string = "TestScene";

    @property({ type: cc.Node })
    private testView: cc.Node = null;

    @property({ type: cc.Slider })
    private redSlider: cc.Slider = null;

    @property({ type: cc.Slider })
    private greenSlider: cc.Slider = null;

    @property({ type: cc.Slider })
    private blueSlider: cc.Slider = null;

    @property({ type: cc.Slider })
    private alphaSlider: cc.Slider = null;

    @property({ type: cc.Slider })
    private lightWidthSlider: cc.Slider = null;

    @property({ type: cc.Slider })
    private lightAngleSlider: cc.Slider = null;

    @property({ type: cc.Label })
    private txtRed: cc.Label = null;

    @property({ type: cc.Label })
    private txtGreen: cc.Label = null;

    @property({ type: cc.Label })
    private txtBlue: cc.Label = null;

    @property({ type: cc.Label })
    private txtAlpha: cc.Label = null;

    @property({ type: cc.Label })
    private txtLightWidth: cc.Label = null;

    @property({ type: cc.Label })
    private txtLightAngle: cc.Label = null;

    onLoad() {
    }

    start() {
        // ShaderHelper.setRoundCornerCrop(this.testView, 0.1)
        // this.onSlider();
    }


    // private onSlider() {
    //     // ShaderHelper.setRoundCornerCrop(this.testView, this.slider.progress)
    //     let lightColor: cc.Color = cc.color(
    //         Math.round(255 * this.redSlider.progress),
    //         Math.round(255 * this.greenSlider.progress),
    //         Math.round(255 * this.blueSlider.progress),
    //         Math.round(255 * this.alphaSlider.progress)
    //     )
    //     let lightWidth: number = this.lightWidthSlider.progress;
    //     let lightAngle: number = 180 * this.lightAngleSlider.progress;
    //     let enableGradient: boolean = true; //启用光束渐变
    //     let cropAlpha: boolean = true; // 裁剪掉透明区域上的光
    //     let enableFog: boolean = false;

    //     this.txtRed.string = Math.round(255 * this.redSlider.progress) + ""
    //     this.txtGreen.string = Math.round(255 * this.redSlider.progress) + ""
    //     this.txtBlue.string = Math.round(255 * this.redSlider.progress) + ""
    //     this.txtAlpha.string = Math.round(255 * this.redSlider.progress) + ""
    //     this.txtLightWidth.string = lightWidth + ""
    //     this.txtLightAngle.string = lightAngle + ""
    //     // ShaderHelper.showFlashLightMv(this.testView)
    //     // ShaderHelper.showFlash(this.testView)
    //     // ShaderHelper.setFlag(this.testView)
    //     ShaderHelper.showOldPhotoMv(this.testView)
    //     // ShaderHelper.setFlashLight(this.testView, lightColor, lightWidth, lightAngle, enableGradient, cropAlpha, enableFog)
    // }

    // update (dt) {}
}
