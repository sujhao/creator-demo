import PlayerBase from "../players/PlayerBase";
import ShaderHelper from "../../engine/utils/ShaderHelper";
import ColorHelper from "../../engine/utils/ColorHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SimplePlayerInfoPrefab extends cc.Component {

    @property({ type: cc.Label })
    private txtName: cc.Label = null;

    @property({ type: cc.Label })
    private txtLife: cc.Label = null;

    @property({ type: cc.Label })
    private txtPower: cc.Label = null;

    @property({ type: cc.Node })
    private heartIcon:cc.Node = null;


    onLoad(){
        ShaderHelper.setCommonGlowInner(this.heartIcon, ColorHelper.getColor("#FCBB13"))
    }

    public setInfo(player: PlayerBase) {
        this.txtName.string = "" + player.playerInfo.name;
        this.txtLife.string = "" + player.life+" / "+player.playerInfo.life;
        this.txtPower.string = "" + player.power + " / "+player.playerInfo.power;
    }

}
