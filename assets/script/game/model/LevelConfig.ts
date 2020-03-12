import PlayerType, { PlayerSide } from "./PlayerType";
import PlayerInfo from "./PlayerInfo";
import Level1Scene from "../scene/level/Level1Scene";
import Level2Scene from "../scene/level/Level2Scene";

export default class LevelConfig {

    public static firstActionConfig: Array<number> = [
        1, //level1
    ]

    public static sceneConfig: Array<string> = [
        Level1Scene.scriptName,
        Level2Scene.scriptName,
    ]

    //玩家配置
    public static playerConfig: Array<any> = [
        [//level1
            {
                "row": 4,
                "col": 4,
                "side": PlayerSide.Down,
                "playerInfo": PlayerInfo.createPlayer(PlayerType.jhao, "豪大大1"),
                "isEnemy": false,
                "levelStep":1,
            },
            {
                "row": 5,
                "col": 11,
                "side": PlayerSide.Left,
                "playerInfo": PlayerInfo.createPlayer(PlayerType.bing1, "蓝盔军", 1, 4, 1, 5, 0, [], [], 6, 6, 0),
                "isEnemy": true,
                "levelStep":1,
            },
            {
                "row": 5,
                "col": 15,
                "side": PlayerSide.Left,
                "playerInfo": PlayerInfo.createPlayer(PlayerType.bing1, "蓝盔军", 1, 4, 1, 5, 0, [], [], 6, 6, 0),
                "isEnemy": true,
                "levelStep":2,
            },
            {
                "row": 4,
                "col": 22,
                "side": PlayerSide.Left,
                "playerInfo": PlayerInfo.createPlayer(PlayerType.bing1, "蓝盔军", 1, 4, 1, 5, 0, [], [], 6, 6, 0),
                "isEnemy": true,
                "levelStep":3,
            },
            {
                "row": 6,
                "col": 22,
                "side": PlayerSide.Left,
                "playerInfo": PlayerInfo.createPlayer(PlayerType.bing1, "蓝盔军", 1, 4, 1, 5, 0, [], [], 6, 6, 0),
                "isEnemy": true,
                "levelStep":3,
            },
            {
                "row": 5,
                "col": 23,
                "side": PlayerSide.Left,
                "playerInfo": PlayerInfo.createPlayer(PlayerType.bing2, "绿盔军", 1, 4, 1, 10, 0, [], [], 7, 6, 0),
                "isEnemy": true,
                "levelStep":3,
            }
        ],
        [ //level2

        ]
    ]
}