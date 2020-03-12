import { Logger } from "../../engine/utils/Logger";
import WalkGridManager from "../manager/WalkGridManager";
import TileMapBase from "../tilemap/TileMapBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoveGridPrefab extends cc.Component {

    public row:number = 0;
    public col:number = 0;
 
}

