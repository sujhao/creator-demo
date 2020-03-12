import EventManager, { HaoEvent } from "../../engine/utils/EventManager";
import Grid from "../../engine/utils/Grid";
import { Logger } from "../../engine/utils/Logger";
import ShaderHelper from "../../engine/utils/ShaderHelper";
import { GameState } from "../model/GameState";
import LevelInfo from "../model/LevelInfo";
import { PlayerSide } from "../model/PlayerType";
import PlayerBase from "../players/PlayerBase";
import PlayerManager from "../players/PlayerManager";
import AttackGridPrefab from "../prefab/AttackGridPrefab";
import AttackSelectGrid from "../prefab/AttackSelectGrid";
import ControlUI, { ControlUI_Event } from "../prefab/ControlUI";
import GiftPrefab from "../prefab/GiftPrefab";
import ResourcePrefab from "../prefab/ResourcePrefab";
import TileMapBase from "../tilemap/TileMapBase";
import GiftManager from "./GiftManager";
import ScorePrefabManager from "./ScorePrefabManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AttackGridManager extends cc.Component {

    @property({ type: cc.Node })
    private attackGridContainer: cc.Node = null;

    @property({ type: cc.Node })
    private attackSelectGridContainer: cc.Node = null;

    public static instatnce: AttackGridManager = null;


    private nowAttackGridList: Array<Grid> = [];  //当前攻击区域显示格子

    private nowAttackGridSelectList: Array<Grid> = []; //当前攻击选中格子
    private nowAttackIndex: number = 0;     //当前选中攻击Index


    onLoad() {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this);
        AttackGridManager.instatnce = this;
    }

    /**
     * 初始化攻击区域格子
     * @param attackRange 攻击范围
     * @param row 发动攻击玩家所在行
     * @param col 发动攻击玩家所在列
     */
    public initAttackGrid(attackRange: number, row: number, col: number, isEnemy: boolean) {
        this.attackGridContainer.removeAllChildren();
        this.attackSelectGridContainer.removeAllChildren();
        this.nowAttackGridList = [];
        for (let i = col - attackRange; i <= col + attackRange; i++) {
            for (let j = row - attackRange; j <= row + attackRange; j++) {
                if (j >= 0 && j < TileMapBase.instatnce.mapSize.height && i >= 0 && i < TileMapBase.instatnce.mapSize.width) {
                    if (row == j && col == i) { //自己的格子
                    } else {
                        let distance: number = Math.abs(i - col) + Math.abs(j - row);
                        if (distance <= attackRange) {
                            this.createGrid(j, i, isEnemy)
                        }
                    }
                }
            }
        }
        let grid: Grid = this.nowAttackGridSelectList[this.nowAttackIndex];
        this.createAttackSelectGrid(grid.row, grid.col);
    }

    /**
     * 创建攻击对象选中格子
     * @param row 
     * @param col 
     */
    private createAttackSelectGrid(row: number, col: number) {
        let prefab: cc.Prefab = ResourcePrefab.getAttackSelectGridPrefab();
        let grid: cc.Node = cc.instantiate(prefab);
        this.attackSelectGridContainer.addChild(grid, 99);
        grid.getComponent(AttackSelectGrid).row = row;
        grid.getComponent(AttackSelectGrid).col = col;
        grid.setPosition(TileMapBase.instatnce.getTileGlobalLocationByRowCol(row, col))
    }

    /**
     * 创建攻击范围格子
     * @param row 
     * @param col 
     * @param isEnemy 
     */
    private createGrid(row: number, col: number, isEnemy: boolean) {
        this.nowAttackGridList.push(new Grid(row, col))
        let prefab: cc.Prefab = ResourcePrefab.getAttackGridPrefab();
        let grid: cc.Node = cc.instantiate(prefab);
        if (isEnemy) {
            grid.color = cc.Color.RED;
        }
        this.attackGridContainer.addChild(grid);
        grid.getComponent(AttackGridPrefab).row = row;
        grid.getComponent(AttackGridPrefab).col = col;
        grid.setPosition(TileMapBase.instatnce.getTileGlobalLocationByRowCol(row, col))
    }



    /**
     * 清除攻击格子
     */
    public clearGrid() {
        this.nowAttackGridList = [];
        this.nowAttackGridSelectList = []
        this.attackGridContainer.removeAllChildren();
        this.attackSelectGridContainer.removeAllChildren()
    }

    /**
     * 返回发动攻击玩家能攻击到的格子
     * @param attackRange  攻击范围(射程)
     * @param row 发动攻击所在行
     * @param col 发动攻击所在列
     */
    public getAttackGridList(attackRange: number, row: number, col: number) {
        this.nowAttackGridSelectList = [];
        this.nowAttackIndex = 0;
        for (let i = col - attackRange; i <= col + attackRange; i++) {
            for (let j = row - attackRange; j <= row + attackRange; j++) {
                if (j >= 0 && j < TileMapBase.instatnce.mapSize.height && i >= 0 && i < TileMapBase.instatnce.mapSize.width) {
                    if (row == j && col == i) { //自己的格子
                    } else {
                        let distance: number = Math.abs(i - col) + Math.abs(j - row);
                        if (distance <= attackRange) {
                            let player: PlayerBase = PlayerManager.instatnce.getPlayerByRowCol(j, i);
                            if (player || GiftManager.instatnce.isHadGift(j, i)) {
                                this.nowAttackGridSelectList.push(new Grid(j, i));
                            }
                        }
                    }
                }
            }
        }
        return this.nowAttackGridSelectList;
    }

    private onControlUIEvent(event:HaoEvent, keyType: number) {
        if (keyType == ControlUI_Event.Up || keyType == ControlUI_Event.Down ||
            keyType == ControlUI_Event.Left || keyType == ControlUI_Event.Right) {
            if (this.nowAttackGridSelectList.length > 0) {
                this.nowAttackIndex++;
                if (this.nowAttackIndex >= this.nowAttackGridSelectList.length) {
                    this.nowAttackIndex = 0;
                }
                this.attackSelectGridContainer.removeAllChildren();
                let grid: Grid = this.nowAttackGridSelectList[this.nowAttackIndex];
                this.createAttackSelectGrid(grid.row, grid.col);
            }
        } else if (keyType == ControlUI_Event.A) {
            if (LevelInfo.gameState == GameState.SelectItem && this.nowAttackGridSelectList.length > 0) {
                this.tryAttack();
            }
        }
    }


    /**
     * 发动攻击，被攻击对象可能是角色，可能是宝箱
     */
    public tryAttack() {
        if (this.nowAttackGridSelectList.length > 0) {
            let beAttackGrid: Grid = this.nowAttackGridSelectList[this.nowAttackIndex];
            let beAttackPlayer: PlayerBase = PlayerManager.instatnce.getPlayerByRowCol(beAttackGrid.row, beAttackGrid.col)
            if (beAttackPlayer) {
                this.attackPlayer(beAttackGrid, beAttackPlayer)
            } else {
                let giftPrefab: GiftPrefab = GiftManager.instatnce.getGift(beAttackGrid.row, beAttackGrid.col);
                if (giftPrefab) {
                    this.attackGift(beAttackGrid, giftPrefab);
                }
            }
        }
    }

    /**
     * 攻击玩家
     * @param beAttackGrid 被攻击格子
     * @param beAttackPlayer 被攻击玩家
     */
    private attackPlayer(beAttackGrid: Grid, beAttackPlayer: PlayerBase) {
        let nowPlayer: PlayerBase = PlayerManager.instatnce.getNowActionPlayer();
        let attackSide: number = this.getAttackSide(Grid.init(nowPlayer.row, nowPlayer.col), beAttackGrid)
        nowPlayer.playAttack(attackSide)
        ShaderHelper.showFlash(beAttackPlayer.node)
        let score: number = nowPlayer.playerInfo.attack - beAttackPlayer.playerInfo.defend
        if (score < 0) {
            let percent: number = Math.abs(score) / 100;
            let random: number = Math.random();
            if (random > percent) {
                score = 1; //减少一滴血
            } else {
                score = 0; //miss
            }
        }
        beAttackPlayer.life -= score;
        this.scheduleOnce(() => {
            ScorePrefabManager.instatnce.showAttackScore(score, beAttackPlayer.node.getPosition())
            if (beAttackPlayer.life <= 0) {
                ShaderHelper.showMosaicMv(beAttackPlayer.node, () => {
                    PlayerManager.instatnce.removePlayer(beAttackPlayer)
                })
            }
            this.scheduleOnce(() => {
                PlayerManager.instatnce.onNextPlayerAction();
            }, 1)
        }, 1)
    }

    /**
     * 攻击宝箱
     * @param beAttackGrid 被攻击格子 
     * @param giftPrefab 被攻击宝箱
     */
    private attackGift(beAttackGrid: Grid, giftPrefab: GiftPrefab) {
        let nowPlayer: PlayerBase = PlayerManager.instatnce.getNowActionPlayer();
        let attackSide: number = this.getAttackSide(Grid.init(nowPlayer.row, nowPlayer.col), beAttackGrid)
        nowPlayer.playAttack(attackSide)
        giftPrefab.node.active = true;
        ShaderHelper.showFlash(giftPrefab.node)
        this.scheduleOnce(() => {
            giftPrefab.showGiftMv(()=>{
                this.scheduleOnce(() => {
                    PlayerManager.instatnce.onNextPlayerAction();
                }, 1)
            })
        }, 1)
    }

    /**
     * 获取攻击玩家方向
     * @param attack 发动攻击所在格子
     * @param beAttack 被攻击格子
     */
    private getAttackSide(attack: Grid, beAttack: Grid) {
        if (beAttack.row > attack.row) {
            return PlayerSide.Down
        }
        else if (beAttack.row < attack.row) {
            return PlayerSide.Up;
        }
        else if (beAttack.col > attack.col) {
            return PlayerSide.Right
        } else if (beAttack.col < attack.col) {
            return PlayerSide.Left
        } else {
            return PlayerSide.Down
        }
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
        AttackGridManager.instatnce = null;
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent);
    }
}