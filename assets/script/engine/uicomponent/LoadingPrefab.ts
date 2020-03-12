import PrefabLoader from "../utils/PrefabLoader";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingPrefab extends cc.Component {

    public static instance:cc.Node;

    private static prefab:cc.Prefab;

    public static LoadingZorderIndex:number = 99;

    @property({type:cc.Node})
    loadingSp:cc.Node = null;


    onLoad (){
       
    } 

    start () {
    }

    public static close(){
        if(!LoadingPrefab.instance){
            return;
        }
        LoadingPrefab.instance.removeFromParent();
        LoadingPrefab.instance.destroy();
        LoadingPrefab.instance = null;
    }

    public static preLoad():Promise<void>{
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("share/uicomponent/LoadingPrefab", (loadedResource)=>{
                LoadingPrefab.prefab = loadedResource;
                resolve();
            });
        })
    }

    private static createLoadingPrefab(parentNode:cc.Node = null){
        let dialogNode:cc.Node = cc.instantiate(LoadingPrefab.prefab);
        LoadingPrefab.instance = dialogNode;
        if(!parentNode){
            parentNode = cc.Canvas.instance.node;
        }
        parentNode.addChild(dialogNode, LoadingPrefab.LoadingZorderIndex);
        dialogNode.setPosition(0, 0);
    }

    public static async show(parentNode:cc.Node=null){
        if(LoadingPrefab.instance)return;
        if(!LoadingPrefab.prefab){
            await LoadingPrefab.preLoad();
        }
        this.createLoadingPrefab(parentNode);
    }

    update (dt) {
        this.loadingSp.rotation += 10;
        if(this.loadingSp.rotation >= 360){
            this.loadingSp.rotation = 0;
        }
    }

    public static clear(){
        LoadingPrefab.instance = null;
        LoadingPrefab.prefab = null;
    }
}
