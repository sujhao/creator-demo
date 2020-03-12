import LevelSceneBase from "./LevelSceneBase";
import LevelInfo from "../../model/LevelInfo";
import { GameState } from "../../model/GameState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Level2Scene extends LevelSceneBase{

    public static scriptName: string = "Level2Scene";

    onLoadMe() { 
        LevelInfo.gameState = GameState.Chat;
    }

}
