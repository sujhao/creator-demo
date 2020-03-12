import PrefabLoader from "../../engine/utils/PrefabLoader";
import PlayerType from "../model/PlayerType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResourcePrefab extends cc.Component {

    private static prefab: cc.Prefab = null;
    

    public static instance:cc.Node;
    
    @property({type:cc.Prefab})
    private moveGripPrefab:cc.Prefab = null;

    @property({type:cc.Prefab})
    private attackGridPrefab:cc.Prefab = null;

    @property({type:cc.Prefab})
    private attackSelectGridPrefab:cc.Prefab = null;

    @property({type:cc.Prefab})
    private scorePrefab:cc.Prefab = null;

    @property({type:cc.Prefab})
    private giftPrefab:cc.Prefab = null;

    @property({type:cc.Prefab})
    private controlUI:cc.Prefab = null;

    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("game/prefab/ResourcePrefab", (loadedResource: cc.Prefab) => {
                ResourcePrefab.prefab = loadedResource;
                ResourcePrefab.instance = cc.instantiate(loadedResource)
                resolve();
            });
        })
    }

    public static clear(){
        ResourcePrefab.instance = null;
        ResourcePrefab.prefab = null;
    }

    public static getMoveGridPrefab(){
        return ResourcePrefab.instance.getComponent(ResourcePrefab).moveGripPrefab;
    }

    public static getAttackGridPrefab(){
        return ResourcePrefab.instance.getComponent(ResourcePrefab).attackGridPrefab;
    }

    public static getAttackSelectGridPrefab(){
        return ResourcePrefab.instance.getComponent(ResourcePrefab).attackSelectGridPrefab;
    }

    public static getScorePrefab(){
        return ResourcePrefab.instance.getComponent(ResourcePrefab).scorePrefab;
    }

    public static getGiftPrefab(){
        return ResourcePrefab.instance.getComponent(ResourcePrefab).giftPrefab;
    }

    public static getControlUIPrefab(){
        return ResourcePrefab.instance.getComponent(ResourcePrefab).controlUI;
    }


}
