import PrefabLoader from "../utils/PrefabLoader";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonTips extends cc.Component {

    public static TipsZorderIndex: number = 999;

    @property({ type: cc.Label })
    txtContent: cc.Label = null;

    private tips: string = "";

    private static showingNameList: Array<string> = []

    onLoad() {
    }

    start() {
        cc.tween(this.node).by(1.5, { position: cc.v2(0, 100) }).to(0.2, { opacity: 0 }).call(() => {
            this.node.destroy();
        }).start()
    }

    onDestroy() {
        let index: number = CommonTips.showingNameList.indexOf(this.tips);
        CommonTips.showingNameList.splice(index, 1);
        this.unscheduleAllCallbacks();
    }

    public static showMsg(msg: string, parentNode: cc.Node = null) {
        PrefabLoader.loadPrefab("share/uicomponent/CommonTips", (loadedResource) => {
            if (!parentNode) {
                parentNode = cc.Canvas.instance.node;
            }
            if (CommonTips.showingNameList.indexOf(msg) != -1) {
                return;
            } else {
                CommonTips.showingNameList.push(msg);
            }
            let dialogNode = cc.instantiate(loadedResource);
            dialogNode.setPosition(0, 0);
            let dialogScript: CommonTips = dialogNode.getComponent(CommonTips);
            dialogScript.tips = msg;
            dialogScript.txtContent.string = msg;
            parentNode.addChild(dialogNode, CommonTips.TipsZorderIndex);
        });
    }

}
