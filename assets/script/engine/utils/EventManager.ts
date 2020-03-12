import { Logger } from "./Logger";
import ColorHelper from "./ColorHelper";

export class HaoEvent {
    public callback: Function;
    public caller: any;
    public isStop: boolean;

    constructor(callback: Function, caller: any) {
        this.callback = callback;
        this.caller = caller;
        this.isStop = false;
    }
}

export default class EventManager {
    public static instance: EventManager = new EventManager();

    private callbackList = {};

    public constructor() {
    }

    //注册事件
    public addListener(eventName: string, callback: Function, caller: any) {
        if (this.callbackList[eventName]) {
            let eventList: Array<HaoEvent> = this.callbackList[eventName];
            //不同元件才放入,相同元件覆蓋
            let add: boolean = true;
            for (let i = 0; i < eventList.length; i++) {
                let event:HaoEvent = eventList[i];
                if (caller === event.caller) {
                    add = false;
                }
            }
            if (add) {
                eventList.push(new HaoEvent(callback, caller))
                this.callbackList[eventName] = eventList;
            }
        }
        else {
            // this.callbackList[eventName] = [[callback, caller]];
            this.callbackList[eventName] = [new HaoEvent(callback, caller)];
        }
    }

    public removeListener(eventName: string, callback: Function) {
        if (this.callbackList[eventName]) {
            for (let i = this.callbackList[eventName].length - 1; i >= 0; i--) {
                let event: HaoEvent = this.callbackList[eventName][i]
                if (event.callback == callback) {
                    this.callbackList[eventName].splice(i, 1);
                    break;
                }
            }
        }

    }

    public dispatchEvent(eventName, parameter?: any, ...restOfName: any[]) {
        let eventList: Array<HaoEvent> = this.callbackList[eventName];
        if (eventList) {
            for (let i = eventList.length - 1; i >= 0; i--) {
                let event:HaoEvent = eventList[i];
                event.callback.call(event.caller, event, parameter, ...restOfName)
                if (event.isStop) {
                    break;
                }
            }
            for (let i = eventList.length - 1; i >= 0; i--) {
                let event:HaoEvent = eventList[i];
                event.isStop = false;
            }
        }

    }


    public addBtnEvent(parentNode: cc.Node, objectNode: cc.Node, scriptName: string, eventName: string, data: any = null) {
        var btn: cc.Button = objectNode.addComponent(cc.Button);
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = parentNode; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = scriptName;//这个是代码文件名
        clickEventHandler.handler = eventName;
        clickEventHandler.customEventData = data;
        btn.clickEvents.push(clickEventHandler);
        this.addBtnEffect(objectNode);
    }

    public removeBtnEvent(objectNode: cc.Node) {
        objectNode.removeComponent(cc.Button)
    }

    public removeBtnEffect(objectNode: cc.Node) {
        var b = objectNode.getComponent(cc.Button);
        b.transition = cc.Button.Transition.NONE;
    }

    public addBtnEffect(objectNode: cc.Node, scale: number = 1.1) {
        var b = objectNode.getComponent(cc.Button);
        b.transition = cc.Button.Transition.SCALE;
        b.zoomScale = scale;
    }

    public addBtnEffect_color(objectNode: cc.Node, normalC: cc.Color = ColorHelper.getColor("#FFFFFF"), pressC: cc.Color = ColorHelper.getColor("#C0C0C0")) {
        var b = objectNode.getComponent(cc.Button);
        b.transition = cc.Button.Transition.COLOR;
        b.normalColor = normalC;
        b.pressedColor = pressC;
    }

    public addSliderEvent(parentNode: cc.Node, objectNode: cc.Node, EventName: string, data: any) {
        var b = objectNode.getComponent(cc.Slider);
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = parentNode; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = parentNode.name;//这个是代码文件名
        clickEventHandler.handler = EventName;
        clickEventHandler.customEventData = data;
        b.slideEvents.push(clickEventHandler);
    }

}
