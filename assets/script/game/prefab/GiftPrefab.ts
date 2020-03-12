import GiftModel from "../model/GiftModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GiftPrefab extends cc.Component {

    public giftModel:GiftModel;


    public showGiftMv(callback:Function=null){
        let ani:cc.Animation = this.node.getComponent(cc.Animation);
        let clip: cc.AnimationClip = ani.getClips()[0]
        ani.play(clip.name);
        this.scheduleOnce(() => {
            // this.node.active = this.giftModel.isShow;
            this.giftModel.isOpen = true;
            if(callback){
                callback()
            }
        }, clip.duration);
    }

}
