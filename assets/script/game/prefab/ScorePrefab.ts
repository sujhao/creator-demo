const {ccclass, property} = cc._decorator;

@ccclass
export default class ScorePrefab extends cc.Component {


    @property({type:cc.Label})
    private txtScore:cc.Label = null;

    public init(score:number, callback:Function=null){
        if(score <= 0){
            this.txtScore.string = "Miss"
        }else{
            this.txtScore.string = score+""
        }
        cc.tween(this.node).to(1, { position: cc.v2(this.node.x, this.node.y+50) }).call(() => {
            if(callback){
                callback();
            }
        }).start()
    }
}
