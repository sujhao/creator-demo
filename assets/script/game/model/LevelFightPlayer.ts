import PlayerType from "./PlayerType";
import PlayerInfo from "./PlayerInfo";

export default class LevelFightPlayer {

    public level: number;
    public maxPlayerNum: number;
    public mustFightPlayers: Array<number> = [];

    public static nowFightPlayers:Array<PlayerInfo> = []; //当前关卡战斗角色

    public static config: Array<LevelFightPlayer> = [
        LevelFightPlayer.create(1, 1, [PlayerType.jhao]),
    ];

    public static create(level: number, maxPlayerNum: number, mustFightPlayers: Array<number>) {
        let model: LevelFightPlayer = new LevelFightPlayer();
        model.level = level;
        model.maxPlayerNum = maxPlayerNum;
        model.mustFightPlayers = mustFightPlayers;
        return model;
    }

    public static get(nowLevel: number) {
        for (let i = 0; i < this.config.length; i++) {
            let model: LevelFightPlayer = this.config[i];
            if (model.level == nowLevel) {
                return model;
            }
        }
    }
}
