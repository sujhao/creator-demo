
import DialogBase from "../../engine/uicomponent/DialogBase";
import GameMusicHelper from "../utils/GameMusicHelper";
import PrefabLoader from "../../engine/utils/PrefabLoader";
import CommonTips from "../../engine/uicomponent/CommonTips";
import { Logger } from "../../engine/utils/Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DialogNewName extends DialogBase {

    private static ScriptName: string = "DialogNewName";

    @property({ type: cc.EditBox })
    private txtInput: cc.EditBox = null;


    private callback: Function = null;

    onLoadMe() {

    }

    private onClickSure() {
        if (this.txtInput.string == "") {
            CommonTips.showMsg("请输入名称")
            return;
        }
        Logger.log(this, "DialogNewName=", this.txtInput.string);
        if (this.callback) {
            this.callback(this.txtInput.string);
        }
        this.node.destroy();
    }

    public static show(callback: Function = null, parentNode: cc.Node = null) {
        PrefabLoader.loadPrefab("game/dialog/" + this.ScriptName, (loadedResource: cc.Prefab) => {
            if (!parentNode) {
                parentNode = cc.Canvas.instance.node;
            }
            let node: cc.Node = cc.instantiate(loadedResource);
            node.getComponent(DialogNewName).callback = callback;
            parentNode.addChild(node);
            node.setPosition(0, 0)
        });
    }


}