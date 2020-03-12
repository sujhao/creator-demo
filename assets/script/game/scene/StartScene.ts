import EventManager, { HaoEvent } from "../../engine/utils/EventManager";
import BagModel from "../model/BagModel";
import LevelInfo from "../model/LevelInfo";
import PlayerInfo from "../model/PlayerInfo";
import ControlUI, { ControlUI_Event } from "../prefab/ControlUI";
import SceneBase from "./SceneBase";
import SceneManager from "./SceneManager";
import Level1Scene from "./level/Level1Scene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartScene extends SceneBase {

    public static scriptName: string = "StartScene";

    @property({ type: cc.Node })
    private jianMv: cc.Node = null;

    private defaultY: number = -92.984;
    private defaultX: number = -112.749;
    private leftX: number = -132.749;
    private downY: number = -172.984;
    private isDown: boolean = false;


    onLoadMe() {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        // GameMusicHelper.playStory();
        this.jianMv.setPosition(this.defaultX, this.defaultY)
        this.initJianMv();

        // ShaderHelper.showOldPhotoMv(this.jianMv)
        // ShaderHelper.setCommonGlowInner(this.jianMv)
        // ShaderHelper.showFlash(this.jianMv)
        // ShaderHelper.showMosaicMv(this.jianMv)
        //ShaderHelper.setFlag(this.jianMv)
        // ShaderHelper.setGaussian(this.node.getChildByName("startbg"))
        // ShaderHelper.setRoundCornerCrop(this.node.getChildByName("safdfdfd"))
    }

    update() {

    }

    private onControlUIEvent(event:HaoEvent,keyType: number) {
        if (keyType == ControlUI_Event.Up) {
            if (this.isDown) {
                this.isDown = false;
                cc.tween(this.jianMv)
                    .to(0.2, { position: cc.v2(this.jianMv.x, this.defaultY) })
                    .call(() => { this.initJianMv(); })
                    .start()
            }
        } else if (keyType == ControlUI_Event.Down) {
            if (!this.isDown) {
                this.isDown = true;
                cc.tween(this.jianMv)
                    .to(0.2, { position: cc.v2(this.jianMv.x, this.downY) })
                    .call(() => { this.initJianMv(); })
                    .start()
            }
        } else if (keyType == ControlUI_Event.A || keyType == ControlUI_Event.B) {
            if (this.isDown) {
                this.onClickOld();
            } else {
                this.onClickNew();
            }
        }
    }

    private initJianMv() {
        cc.tween(this.jianMv)
            .repeatForever(
                cc.tween().to(0.2, { position: cc.v2(this.leftX, this.jianMv.y) })
                    .to(0.2, { position: cc.v2(this.defaultX, this.jianMv.y) })
            )
            .start()
    }

    private onClickNew() {
        this.initNew();
        // DialogNewName.show((newName:string)=>{
            // this.initNew(newName);
            this.initNew();
        // });
        // SceneManager.instance.sceneSwitch(Level1Scene.scriptName);

        // CommonTips.showMsg("test")
        // ChatManager.instance.startChat(1)
    }

    private initNew(newPlayerName:string="豪野") {
        BagModel.reInitNew();
        PlayerInfo.reInitNew(newPlayerName);
        LevelInfo.nowLevel = 1;
    }

    private onClickOld() {
        this.initNew();
    }

    onDestroyMe() {
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }
}
