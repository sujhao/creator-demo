import EventManager from "../../engine/utils/EventManager";
import LevelInfo from "../model/LevelInfo";
import { GameState } from "../model/GameState";

const { ccclass, property } = cc._decorator;

export enum ControlUI_Event {
    Down = 0,
    Up = 1,
    Left = 2,
    Right = 3,
    A = 4,
    B = 5,
    C = 6,
}

@ccclass
export default class ControlUI extends cc.Component {

    public static Event_ControlUI: string = "Event_ControlUI";

    @property({ type: cc.Node })
    private leftUI: cc.Node = null;

    @property({ type: cc.Node })
    private btnA: cc.Node = null;

    @property({ type: cc.Node })
    private btnB: cc.Node = null;

    @property({ type: cc.Node })
    private btnC: cc.Node = null;

    private jianGe: number = 20;

    public static instance:ControlUI;

    onLoad() {
        ControlUI.instance = this;
        this.initAdapter();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyBoardEvent, this);
    }

    private initAdapter() {
        //这里要把ui适配到左右的下角, cc.Widget控件不知道是有bug还是我还没弄懂，要先在美术上把cc.Widget加上去，然后适配距离也设定好，
        //这里改下对齐的父亲节点就好

        let leftWidget: cc.Widget = this.leftUI.getComponent(cc.Widget);
        leftWidget.target = cc.Canvas.instance.node;
        leftWidget.left = 0
        leftWidget.bottom = 0

        let cWidget: cc.Widget = this.btnC.getComponent(cc.Widget);
        cWidget.target = cc.Canvas.instance.node;
        cWidget.right = 0;
        cWidget.bottom = 0

        let bWidget: cc.Widget = this.btnB.getComponent(cc.Widget);
        bWidget.target = cc.Canvas.instance.node;
        bWidget.right = this.btnC.width + this.jianGe;
        bWidget.bottom = 0
        let aWidget: cc.Widget = this.btnA.getComponent(cc.Widget);
        aWidget.target = cc.Canvas.instance.node;
        aWidget.right = this.btnC.width + this.jianGe + this.btnB.width + this.jianGe;
        aWidget.bottom = 0;
    }

    private onKeyBoardEvent(event) {
        if(!this.node.active){
            return;
        }
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.onClickUp();
                break;
            case cc.macro.KEY.s:
                this.onClickDown();
                break;
            case cc.macro.KEY.a:
                this.onClickLeft();
                break;
            case cc.macro.KEY.d:
                this.onClickRight();
                break;
            case cc.macro.KEY.j:
                this.onClickA();
                break;
            case cc.macro.KEY.k:
                this.onClickB();
                break;
            case cc.macro.KEY.l:
                this.onClickC();
                break;
            case cc.macro.KEY.space:
                this.onClickBook();
                break;
        }
    }

    private onClickBook() {
        LevelInfo.gameState = GameState.Dialog;
    }

    private onClickA() {
        EventManager.instance.dispatchEvent(ControlUI.Event_ControlUI, ControlUI_Event.A)
    }

    private onClickB() {
        EventManager.instance.dispatchEvent(ControlUI.Event_ControlUI, ControlUI_Event.B)
    }

    private onClickC() {
        EventManager.instance.dispatchEvent(ControlUI.Event_ControlUI, ControlUI_Event.C);
    }

    private onClickLeft() {
        EventManager.instance.dispatchEvent(ControlUI.Event_ControlUI, ControlUI_Event.Left)
    }

    private onClickRight() {
        EventManager.instance.dispatchEvent(ControlUI.Event_ControlUI, ControlUI_Event.Right)
    }

    private onClickUp() {
        EventManager.instance.dispatchEvent(ControlUI.Event_ControlUI, ControlUI_Event.Up)
    }

    private onClickDown() {
        EventManager.instance.dispatchEvent(ControlUI.Event_ControlUI, ControlUI_Event.Down)
    }

    onDestroy() {
        ControlUI.instance = null;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyBoardEvent, this);
    }
}
