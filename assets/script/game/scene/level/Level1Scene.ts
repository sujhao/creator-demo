import LevelSceneBase from "./LevelSceneBase";
import LevelInfo from "../../model/LevelInfo";
import { GameState } from "../../model/GameState";
import DialogChat from "../../dialog/DialogChat";
import ChatManager from "../../manager/ChatManager";
import CommonTips from "../../../engine/uicomponent/CommonTips";
import TileMapBase from "../../tilemap/TileMapBase";
import PlayerManager from "../../players/PlayerManager";
import { Logger } from "../../../engine/utils/Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Level1Scene extends LevelSceneBase{

    public static scriptName: string = "Level1Scene";

    onLoadMe() { 
        LevelInfo.gameState = GameState.Chat;
        LevelInfo.levelStep = 1;
    }

    onStartMe(){
        Logger.log(this, "onStartMe")
        // ChatManager.instance.startChat(1, ()=>{
        //     TileMapBase.instatnce.moveNowTile(5, 11)
        //     ChatManager.instance.startChat(2, ()=>{
        //         TileMapBase.instatnce.moveNowTile(4, 4)
                LevelInfo.gameState = GameState.Walk;
                PlayerManager.instatnce.refresh();
        //     })
        // })
    }

}

