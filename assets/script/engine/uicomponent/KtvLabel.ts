import { Logger } from "../utils/Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KtvLabel extends cc.Component {

    @property({ type: cc.Label })
    private txtDefault: cc.Label = null;

    @property({ type: cc.Label })
    private txtMask: cc.Label = null;

    @property({type:cc.Node})
    private maskNode:cc.Node = null;

    private speed: number = 1

    private isPlaying:boolean = false;

    private playEndCallBack:Function

    onLoad() {
        this.init("hello world i am lili you are body learner")
        this.play();
    }

    private init(msg: string, speed: number = 2) {
        this.txtDefault.string = msg;
        this.txtMask.string = msg;
        this.speed = speed;
    }

    public play(playEndCallBack:Function=null){
        this.isPlaying = true;
        this.maskNode.width = 0;
        this.playEndCallBack = playEndCallBack;
    }

    update(){
        if(this.isPlaying){
            this.maskNode.width += this.speed;
            if(this.maskNode.width >= this.txtDefault.node.width){
                this.isPlaying = false;
                if(this.playEndCallBack){
                    this.playEndCallBack();
                }
            }
        }
    }

    onDestroy() {

    }

}
