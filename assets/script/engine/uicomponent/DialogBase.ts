import DarkLayer from "./DarkLayer";
import { Logger } from "../utils/Logger";

const { ccclass } = cc._decorator;

@ccclass
export default class DialogBase extends cc.Component {

    private static LocalZOrder: number = 5;

    private darkLayer: cc.Node = null;

    onLoad() {
        DialogBase.LocalZOrder += 1;
        let closeLayer:cc.Node = this.node.getChildByName("closeLayer")
        if(closeLayer){
            let closeLayerWidget:cc.Widget = closeLayer.getComponent(cc.Widget);
            if(closeLayerWidget){
                closeLayerWidget.target = cc.Canvas.instance.node;
                closeLayerWidget.left = 0;
                closeLayerWidget.right = 0;
                closeLayerWidget.top = 0;
                closeLayerWidget.bottom = 0;
            }
        }
        this.onLoadMe();
    }

    onLoadMe() {

    }

    start(isPlayMv: boolean = false) {
        this.darkLayer = DarkLayer.getDarkLayer();
        this.node.addChild(this.darkLayer, -1);
        if (isPlayMv) {
            this.node.setScale(0, 0);
        } else {
            this.onStartMe();
        }
    }

    onStartMe() {

    }

    onClickClose() {
        this.node.destroy();
    }

    update(dt) {
        this.onUpdateMe(dt);
    }

    onUpdateMe(dt) {

    }

    onDestroy() {
        DialogBase.LocalZOrder -= 1;
        this.onDestroyMe();
    }

    onDestroyMe() {

    }
}
