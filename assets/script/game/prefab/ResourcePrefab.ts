import PrefabLoader from "../../engine/utils/PrefabLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResourcePrefab extends cc.Component {

    private static prefab: cc.Prefab = null;


    public static instance: cc.Node;

    @property({ type: cc.Prefab })
    private scorePrefab: cc.Prefab = null;


    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("game/prefab/ResourcePrefab", (loadedResource: cc.Prefab) => {
                ResourcePrefab.prefab = loadedResource;
                ResourcePrefab.instance = cc.instantiate(loadedResource)
                resolve();
            });
        })
    }

    public static clear() {
        ResourcePrefab.instance = null;
        ResourcePrefab.prefab = null;
    }


    public static getScorePrefab() {
        return ResourcePrefab.instance.getComponent(ResourcePrefab).scorePrefab;
    }

}
