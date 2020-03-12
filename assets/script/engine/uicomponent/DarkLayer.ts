import { Logger } from "../utils/Logger";
import PrefabLoader from "../utils/PrefabLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DarkLayer extends cc.Component {

    private static prefab: cc.Prefab;

    onLoad() {
        this.getComponent(cc.Widget).target = cc.Canvas.instance.node;
    }

    start() {

    }

    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("share/uicomponent/DarkLayer", (loadedResource) => {
                DarkLayer.prefab = loadedResource;
                resolve();
            });
        })
    }

    public static getDarkLayer() {
        let dialogNode: cc.Node = cc.instantiate(DarkLayer.prefab);
        return dialogNode;
    }
}
