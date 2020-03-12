import EventManager, { HaoEvent } from "../../engine/utils/EventManager";
import SceneBase from "./SceneBase";
import SceneManager from "./SceneManager";

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

        // CommonTips.showMsg("test")
        // ChatManager.instance.startChat(1)
    }

    private initNew(newPlayerName:string="豪野") {
    }

    private onClickOld() {
        this.initNew();
    }

    onDestroyMe() {
    }
}
