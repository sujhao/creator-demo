import PrefabLoader from "../utils/PrefabLoader";
import Progress from "./Progress";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingScenePrefab extends cc.Component {

    public static instance:cc.Node;

    private static prefab:cc.Prefab;

    public static LoadingZorderIndex:number = 99;

    @property({ type: cc.Node })
    private progressNode: cc.Node = null;

    onLoad () {
    }

    start () {

    }

    public updateProgress(completedCount: number, totalCount: number, item: any=null){
        this.progressNode.getComponent(Progress).updateProgress(completedCount, totalCount);
    }

    public static updateLoading(completedCount: number, totalCount: number, item: any=null){
        if(LoadingScenePrefab.instance){
            let nodeTs:LoadingScenePrefab = LoadingScenePrefab.instance.getComponent(LoadingScenePrefab);
            if(nodeTs){
                nodeTs.updateProgress(completedCount, totalCount, item);
            }
        }
    }

    private static createPrefab(parentNode:cc.Node = null){
        let dialogNode:cc.Node = cc.instantiate(LoadingScenePrefab.prefab);
        LoadingScenePrefab.instance = dialogNode;
        if(!parentNode){
            parentNode = cc.Canvas.instance.node;
        }
        parentNode.addChild(dialogNode, LoadingScenePrefab.LoadingZorderIndex);
        dialogNode.setPosition(0, 0);
    }

    public static preLoad():Promise<void>{
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("share/uicomponent/LoadingScenePrefab", (loadedResource:cc.Prefab)=>{
                LoadingScenePrefab.prefab = loadedResource;
                resolve();
            });
        })
    }

    public static close(){
        if(!LoadingScenePrefab.instance){
            return;
        }
        LoadingScenePrefab.instance.destroy();
        LoadingScenePrefab.instance = null;
    }

    public static async show(parentNode:cc.Node=null){
        if(LoadingScenePrefab.instance)return;
        if(!LoadingScenePrefab.prefab){
            await LoadingScenePrefab.preLoad();
        }
        this.createPrefab(parentNode);
    }

    public static clear(){
        LoadingScenePrefab.instance = null;
        LoadingScenePrefab.prefab = null;
    }

}
