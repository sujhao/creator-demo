import WheelPrefab from "./WheelPrefab";
import EventManager from "../../engine/utils/EventManager";
import GameEvent from "../config/GameEvent";
import LevelInfo from "../model/LevelInfo";
import { GameState } from "../model/GameState";
import { Logger } from "../../engine/utils/Logger";



export enum PlayerOperate {
    defend = 0, //防
    magic = 1,   //法
    attack = 2, ///攻
    material = 3, //物
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerOperatePrefab extends WheelPrefab {

    protected onLoad() {
        super.onLoad();
        Logger.log(this,"PlayerOperatePrefab onLoad ")
    }

    protected onSelectWheel(index: number) {
        Logger.log(this,"PlayerOperatePrefab.onSelectWheel===", LevelInfo.gameState, this.node.active)
        if(LevelInfo.gameState == GameState.Operate && this.node.active){
            if (index == PlayerOperate.defend) {
                EventManager.instance.dispatchEvent(GameEvent.Event_Player_Action, PlayerOperate.defend)
            }else if (index == PlayerOperate.magic) {
                EventManager.instance.dispatchEvent(GameEvent.Event_Player_Action, PlayerOperate.material)
            } else if (index == PlayerOperate.attack) {
                EventManager.instance.dispatchEvent(GameEvent.Event_Player_Action, PlayerOperate.attack)
            } else if (index == PlayerOperate.material) {
                EventManager.instance.dispatchEvent(GameEvent.Event_Player_Action, PlayerOperate.material)
            }
        }
    }

    protected onDestroy() {
        super.onDestroy();
    }

}
