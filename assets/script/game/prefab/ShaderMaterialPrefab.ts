import PrefabLoader from "../../engine/utils/PrefabLoader";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderMaterialPrefab extends cc.Component {

    public static instance:cc.Node;

        
    @property({type:cc.Material})
    public default:cc.Material = null;
    
    @property({type:cc.Material})
    public grayMaterial:cc.Material = null;

    @property({type:cc.Material})
    public oldPhoto:cc.Material = null;

    @property({type:cc.Material})
    public glowInner:cc.Material = null;

    @property({type:cc.Material})
    public mosaic:cc.Material = null;

    @property({type:cc.Material})
    public roundCornerCrop:cc.Material = null;

    @property({type:cc.Material})
    public flashLight:cc.Material = null;

    @property({type:cc.Material})
    public flag:cc.Material = null;

    @property({type:cc.Material})
    public gaussian:cc.Material = null;


    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("game/prefab/ShaderMaterialPrefab", (loadedResource: cc.Prefab) => {
                ShaderMaterialPrefab.instance = cc.instantiate(loadedResource)
                resolve();
            });
        })
    }


}
