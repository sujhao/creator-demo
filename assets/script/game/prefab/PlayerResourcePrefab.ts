import PrefabLoader from "../../engine/utils/PrefabLoader";
import PlayerType from "../model/PlayerType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerResourcePrefab extends cc.Component {

    private static prefab: cc.Prefab = null;

    public static instance:cc.Node;
    
    @property({type:[cc.Prefab]})
    private playerPrefabList:Array<cc.Prefab> = []

    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("game/prefab/PlayerResourcePrefab", (loadedResource: cc.Prefab) => {
                PlayerResourcePrefab.prefab = loadedResource;
                PlayerResourcePrefab.instance = cc.instantiate(loadedResource)
                resolve();
            });
        })
    }

    public static clear(){
        PlayerResourcePrefab.instance = null;
        PlayerResourcePrefab.prefab = null;
    }

    public static getPlayerPrefab(playerIndex:number=PlayerType.jhao){
        return PlayerResourcePrefab.instance.getComponent(PlayerResourcePrefab).playerPrefabList[playerIndex-1];
    }


}
