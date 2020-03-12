import ResourcePrefab from "../prefab/ResourcePrefab";
import ScorePrefab from "../prefab/ScorePrefab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScorePrefabManager extends cc.Component {

    public static instatnce: ScorePrefabManager = null;

    @property({type:cc.Node})
    private container:cc.Node = null;

    private pool: cc.NodePool

    onLoad() {
        ScorePrefabManager.instatnce = this;
        this.init();
    }

    private init() {
        this.pool = new cc.NodePool();
        for (let i = 0; i < 5; i++) {
            let prefab: cc.Prefab = ResourcePrefab.getScorePrefab();
            let scoreNode: cc.Node = cc.instantiate(prefab);
            this.pool.put(scoreNode)
        }
    }

    /**
     * 展示分数
     * @param score 
     * @param p 
     */
    public showAttackScore(score: number, p:cc.Vec2) {
        let scoreNode: cc.Node = this.createScoreNode();
        scoreNode.setPosition(p)
        this.container.addChild(scoreNode)
        scoreNode.getComponent(ScorePrefab).init(score, ()=>{
            this.pool.put(scoreNode)
        })
    }

    private createScoreNode(){
        if(this.pool.size() > 0){
            return this.pool.get();
        }else{
            let prefab: cc.Prefab = ResourcePrefab.getScorePrefab();
            let scoreNode: cc.Node = cc.instantiate(prefab);
            return scoreNode
        }
    }

    onDestroy() {
        ScorePrefabManager.instatnce = null;
    }
}