import PrefabLoader from "../../engine/utils/PrefabLoader";
import PlayerType from "../model/PlayerType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MagicPrefab extends cc.Component {

    public static instance:cc.Node;
    
    @property({type:[cc.SpriteFrame]})
    private magicSpriteFrameList:Array<cc.SpriteFrame> = []

    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("game/prefab/MagicPrefab", (loadedResource: cc.Prefab) => {
                MagicPrefab.instance = cc.instantiate(loadedResource)
                resolve();
            });
        })
    }

    public static getMagicView(magicId:number):cc.SpriteFrame{
        return MagicPrefab.instance.getComponent(MagicPrefab).magicSpriteFrameList[magicId];
    }


}

