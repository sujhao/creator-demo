
import DialogBase from "../../engine/uicomponent/DialogBase";
import AdapterHelper from "../../engine/utils/AdapterHelper";
import PrefabLoader from "../../engine/utils/PrefabLoader";
import PlayerConfig from "../config/PlayerConfig";
import ChatModel from "../model/ChatModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DialogChat extends DialogBase {

    private static ScriptName: string = "DialogChat";


    @property({ type: cc.Node })
    private chatbg: cc.Node = null;

    @property({ type: cc.Node })
    private namebg: cc.Node = null;

    @property({ type: cc.ScrollView })
    private talkScrollView: cc.ScrollView = null;

    @property({ type: cc.Label })
    private txtName: cc.Label = null;

    @property({ type: cc.Label })
    private txtChat: cc.Label = null;

    @property({ type: cc.Node })
    private btnNext: cc.Node = null;

    private chatModel: ChatModel;
    private callback: Function;
    private chatRow: number = 0;
    private showIndex: number = 0;

    private showRow: number = 2;

    onLoadMe() {
        let Widget: cc.Widget = this.chatbg.getComponent(cc.Widget);
        Widget.target = cc.Canvas.instance.node;
        Widget.left = 0
        Widget.right = 0

        let nameWidge: cc.Widget = this.namebg.getComponent(cc.Widget);
        nameWidge.target = cc.Canvas.instance.node;
        if (this.chatModel.isMe()) {
            nameWidge.left = 0;
        } else {
            nameWidge.left = AdapterHelper.winSizeWidth - this.namebg.width;
        }
    }

    onStartMe() {
        this.initTalk()
        cc.tween(this.btnNext)
            .repeatForever(
                cc.tween().by(0.3, { position: cc.v2(0, 10) }).by(0.3, { position: cc.v2(0, -10) })
            ).start()
    }

    /**
     * 初始化聊天
     * @param isFirst 
     */
    private initTalk() {
        let chatModel: ChatModel = this.chatModel
        if (chatModel.isMe()) {
            this.txtName.string = PlayerConfig.getMyName();
        } else {
            this.txtName.string = chatModel.name;
        }
        this.txtChat.string = chatModel.content;
        this.showIndex = 0;
        this.txtChat.node.setPosition(0, -100)
        cc.tween(this.txtChat.node).to(0.3, { position: cc.v2(0, 0) }).start()
    }

    /**
     * 点击滑动到继续聊天看不到的地方
     */
    private onClickNext() {
        if (this.showIndex + 1 < this.chatRow - this.showRow) {
            this.showIndex++;
            let ty: number = this.txtChat.lineHeight * this.showIndex;
            cc.tween(this.txtChat.node).to(0.25, { position: cc.v2(0, ty) }).start()
        } else {
            if (this.callback) {
                this.callback();
            }
            this.node.destroy();
        }
    }

    onUpdateMe(dt) {
        this.chatRow = Math.ceil(this.txtChat.node.height / this.txtChat.lineHeight);
    }

    onDestroyMe() {
    }

    public static show(chatModel: ChatModel, callback: Function = null, parentNode: cc.Node = null) {
        PrefabLoader.loadPrefab("game/dialog/" + this.ScriptName, (loadedResource: cc.Prefab) => {
            if (!parentNode) {
                parentNode = cc.Canvas.instance.node;
            }
            let node: cc.Node = cc.instantiate(loadedResource);
            node.getComponent(DialogChat).chatModel = chatModel;
            node.getComponent(DialogChat).callback = callback;
            parentNode.addChild(node);
            node.setPosition(0, 0)
        });
    }
}