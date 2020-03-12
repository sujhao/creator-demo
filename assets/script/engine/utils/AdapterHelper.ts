import {Logger} from "./Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdapterHelper {


    public static winSizeWidth:number;
    public static winSizeHeiht:number;

    public static fixApdater() {
        let framesize = cc.view.getFrameSize();
        if(!this.winSizeWidth){
            this.winSizeWidth = cc.winSize.width;   
            this.winSizeHeiht = cc.winSize.height;
        }
        let designsize = cc.view.getDesignResolutionSize();
        let canvas: cc.Canvas = cc.Canvas.instance;
        
        let ratio: number = framesize.height / framesize.width;
        let designRatio: number = designsize.height / designsize.width;
        if (ratio > designRatio) {
            canvas.fitHeight = false;
            canvas.fitWidth = true;
        } else {
            canvas.fitHeight = true;
            canvas.fitWidth = false;
        }
    }
}


