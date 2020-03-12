import PlayerInfo from "../model/PlayerInfo";
import PlayerType from "../model/PlayerType";

/**
 * 玩家默认配置
 */
export default class PlayerConfig {
    public static playerType2Info: Map<number, PlayerInfo> = new Map<number, PlayerInfo>();

    /**
     * 重置玩家信息
     * @param newPlayerName 
     */
    public static reInitNew(newPlayerName: string){
        this.playerType2Info.set(PlayerType.jhao, PlayerInfo.createPlayer(PlayerType.jhao, newPlayerName, 1, 4, 1, 12, 3, [], [], 9, 4, 0))
    }

    /**
     * 返回我的名字
     */
    public static getMyName() {
        let mePlayer: PlayerInfo = PlayerConfig.playerType2Info.get(PlayerType.jhao)
        return mePlayer.name;
    }



}
