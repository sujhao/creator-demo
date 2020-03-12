import EventManager, { HaoEvent } from "../../engine/utils/EventManager";
import MathUtils from "../../engine/utils/MathUtils";
import ControlUI, { ControlUI_Event } from "./ControlUI";
import { Logger } from "../../engine/utils/Logger";


const { ccclass, property } = cc._decorator;

export enum WheelSide{
    Left=0,    //向左滚动
    Right=1,    //向右滚动
}


@ccclass
export default class WheelPrefab extends cc.Component {

    @property({ type: [cc.Node] })
    protected wheelItems: Array<cc.Node> = [];

    private isMovingWheel: boolean = false;
    private wheelSpeed: number = 4;
    private wheelRotList: Array<number> = []; //滚轮里的每个item的角度
    private wheelTargetRotList: Array<number> = []; //滚轮里的每个item的目的地角度

    private wheelRadius: number = 50; //滚轮半径
    private nowWheelIndex: number = 0; //当前滚轮正上方的index;
    private nowWheelSide:number = WheelSide.Left; //当前滚动方向

    protected onLoad() {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        this.initWheelRot(true);
    }

    /**
     * 控制UI事件
     * @param keyType 
     */
    protected onControlUIEvent(event:HaoEvent,keyType: number) {
        if(!this.node.active)return //当控件隐藏时不能操作
        if (keyType == ControlUI_Event.Up) {
            this.moveWheel(WheelSide.Left)
        } else if (keyType == ControlUI_Event.Down) {
            this.moveWheel(WheelSide.Right)
        } else if (keyType == ControlUI_Event.Left) {
            this.moveWheel(WheelSide.Left)
        } else if (keyType == ControlUI_Event.Right) {
            this.moveWheel(WheelSide.Right)
        }else if(keyType == ControlUI_Event.A){
            this.onSelectWheel(this.nowWheelIndex)
        }
    }

    /**
     * 设置滚动角度
     * @param isFirst  第一次设置
     */
    protected initWheelRot(isFirst:boolean=false) {
        let perRot: number = 360 / this.wheelItems.length
        for (let i = 0; i < this.wheelItems.length; i++) {
            let jiange: number = (i - this.nowWheelIndex + this.wheelItems.length)%this.wheelItems.length;
            let nowRot: number = 90 + perRot * jiange;
            this.wheelTargetRotList[i] = nowRot;
            this.isMovingWheel = true;
            if(isFirst){ //第一次直接初始滚轮位置
                this.wheelRotList[i] = nowRot;
                let rad: number = MathUtils.degreesToRadians(nowRot);
                let targetX: number = this.wheelRadius * Math.cos(rad)
                let targetY: number = this.wheelRadius * Math.sin(rad);
                this.wheelItems[i].setPosition(targetX, targetY)
                this.isMovingWheel = false;
            }
        }
    }

    /**
     * 移动滚轮
     * @param side WheelSide.Left 
     */
    private moveWheel(side: number) {
        if (this.wheelItems.length > 0 && !this.isMovingWheel) {
            this.nowWheelSide = side;
            if (side == WheelSide.Left) {
                this.nowWheelIndex -= 1;
                if (this.nowWheelIndex < 0) {
                    this.nowWheelIndex = this.wheelItems.length - 1
                }
            } else {
                this.nowWheelIndex += 1;
                if (this.nowWheelIndex >= this.wheelItems.length) {
                    this.nowWheelIndex = 0;
                }
            }
            this.initWheelRot()
        }
    }

    /**
     * 通过改变滚轮角度来实现圆形移动
     */
    private checkMovingWheel(){
        if(this.isMovingWheel){
            for(let i=0; i<this.wheelItems.length; i++){
                if(this.nowWheelSide == WheelSide.Left){
                    this.wheelRotList[i] += this.wheelSpeed;
                }else{
                    this.wheelRotList[i] -= this.wheelSpeed;
                }
                let rad: number = MathUtils.degreesToRadians(this.wheelRotList[i]);
                let targetX: number = this.wheelRadius * Math.cos(rad)
                let targetY: number = this.wheelRadius * Math.sin(rad);
                this.wheelItems[i].setPosition(targetX, targetY)
                if(Math.abs(this.wheelTargetRotList[i]-this.wheelRotList[i]) <= this.wheelSpeed){
                    this.isMovingWheel = false;
                }
            }
            if(!this.isMovingWheel){
                this.initWheelRot(true)
            }
        }
    }

    protected update(dt) {
        this.checkMovingWheel();
    }


    /**
     * 选中了哪个滚轮，子类可以重写这个函数得到现在选择了哪个
     * @param index 
     */
    protected onSelectWheel(index:number){

    }

    protected onDestroy() {
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }
}
