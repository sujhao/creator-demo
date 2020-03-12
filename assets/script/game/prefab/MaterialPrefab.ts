import PrefabLoader from "../../engine/utils/PrefabLoader";
import PlayerType from "../model/PlayerType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MaterialPrefab extends cc.Component {

    public static instance:cc.Node;
    
    @property({type:[cc.SpriteFrame]})
    private materialSpriteFrameList:Array<cc.SpriteFrame> = []

    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("game/prefab/MaterialPrefab", (loadedResource: cc.Prefab) => {
                MaterialPrefab.instance = cc.instantiate(loadedResource)
                resolve();
            });
        })
    }

    public static getMaterialView(materialId:number):cc.SpriteFrame{
        return MaterialPrefab.instance.getComponent(MaterialPrefab).materialSpriteFrameList[materialId];
    }


}
