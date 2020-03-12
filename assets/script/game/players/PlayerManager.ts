import EventManager, { HaoEvent } from "../../engine/utils/EventManager";
import { Logger } from "../../engine/utils/Logger";
import GameEvent from "../config/GameEvent";
import WalkGridManager from "../manager/WalkGridManager";
import { GameState } from "../model/GameState";
import LevelConfig from "../model/LevelConfig";
import LevelInfo from "../model/LevelInfo";
import { PlayerSide } from "../model/PlayerType";
import ControlUI, { ControlUI_Event } from "../prefab/ControlUI";
import ResourcePrefab from "../prefab/ResourcePrefab";
import PlayerBase from "./PlayerBase";
import TileMapBase from "../tilemap/TileMapBase";
import Grid from "../../engine/utils/Grid";
import DialogPlayerInfo from "../dialog/DialogPlayerInfo";
import PlayerOperatePrefab, { PlayerOperate } from "../prefab/PlayerOperatePrefab";
import SimplePlayerInfoPrefab from "../prefab/SimplePlayerInfoPrefab";
import CommonTips from "../../engine/uicomponent/CommonTips";
import MaterialOperateWheelPrefab from "../prefab/MaterialOperateWheelPrefab";
import MagicOperateWheelPrefab from "../prefab/MagicOperateWheelPrefab";
import PlayerInfo from "../model/PlayerInfo";
import AttackGridManager from "../manager/AttackGridManager";
import PlayerResourcePrefab from "../prefab/PlayerResourcePrefab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerManager extends cc.Component {

    public static instatnce: PlayerManager = null;

    @property({ type: cc.Node })
    private container: cc.Node = null;    //玩家容器

    @property({ type: cc.Prefab })
    private playerOperatePrefab: cc.Prefab = null;

    @property({ type: cc.Prefab })
    private simplePlayerInfoPrefab: cc.Prefab = null;

    @property({ type: cc.Prefab })
    private materialOperatePrefab: cc.Prefab = null;

    @property({ type: cc.Prefab })
    private magicOperatePrefab: cc.Prefab = null;

    private playerList: Array<PlayerBase> = [];   //当前关卡所有的玩家
    private simplePlayerInfoNode: SimplePlayerInfoPrefab = null;

    private playerOperateUI: PlayerOperatePrefab; //玩家操作UI
    private materialOperateUI: MaterialOperateWheelPrefab; //物品操作UI
    private magicOperateUI: MagicOperateWheelPrefab; //魔法UI

    onLoad() {
        EventManager.instance.addListener(GameEvent.Event_Player_Action, this.onPlayerAction, this)
        EventManager.instance.addListener(GameEvent.Event_Player_Material_Action, this.onPlayerMaterialAction, this);
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        PlayerManager.instatnce = this;
    }

    start() {
    }

    public init() {
        this.initPlayers();
    }

    /**
     * 
     * 初始化当前关卡的所有角色
     */
    private initPlayers() {
        this.simplePlayerInfoNode = cc.instantiate(this.simplePlayerInfoPrefab).getComponent(SimplePlayerInfoPrefab)
        this.container.addChild(this.simplePlayerInfoNode.node, 999);
        this.simplePlayerInfoNode.node.active = false;
        this.playerList = [];
        LevelInfo.nowActionPlayerId = LevelConfig.firstActionConfig[LevelInfo.nowLevel - 1];
        LevelInfo.showActionPlayerId = LevelInfo.nowActionPlayerId;
        let playerConfigList: Array<object> = LevelConfig.playerConfig[LevelInfo.nowLevel - 1]
        for (let i = 0; i < playerConfigList.length; i++) {
            let playerObj: object = playerConfigList[i];
            let playerInfo: PlayerInfo = playerObj["playerInfo"];
            let prefab: cc.Prefab = PlayerResourcePrefab.getPlayerPrefab(playerInfo.playerType)
            let p: PlayerBase = cc.instantiate(prefab).getComponent(PlayerBase);
            p.id = i + 1;
            let row: number = playerObj["row"];
            let col: number = playerObj["col"];
            p.setRowCol(row, col);
            p.setSide(playerObj["side"])
            p.isEnemy = playerObj["isEnemy"]
            if (p.isEnemy) { //敌人读取配置
                p.playerInfo = playerInfo
            } else { //角色读取最新信息
                Logger.log(this, "initPlayers===", PlayerInfo.getPlayerInfoByPlayerType(playerInfo.playerType))
                p.playerInfo = PlayerInfo.getPlayerInfoByPlayerType(playerInfo.playerType);
            }
            p.life = p.playerInfo.life;
            p.power = p.playerInfo.power;
            p.levelStep = playerObj["levelStep"];
            this.playerList.push(p)
            this.container.addChild(p.node)
        }
        this.playerList.sort((playerA: PlayerBase, playerB: PlayerBase) => {
            if (playerA.isEnemy && !playerB.isEnemy) {
                return 1;
            } else if (!playerA.isEnemy && playerB.isEnemy) {
                return -1;//-1表示排在前面
            } else {
                return playerA.id - playerB.id
            }
        });

        for (let i = 0; i < this.playerList.length; i++) {
            this.playerList[i].id = i + 1;
        }
        this.initPlayerUI();
        this.refreshPlayerWalkGrid(LevelInfo.nowActionPlayerId)
        TileMapBase.instatnce.refreshGameState(); //更新地图选择框
        let nowActionPlayer: PlayerBase = this.getNowActionPlayer();
        TileMapBase.instatnce.moveNowTile(nowActionPlayer.row, nowActionPlayer.col)
        this.showSimplePlayerInfo()
    }


    /**
     * 移除死掉的玩家
     * @param p 
     */
    public removePlayer(p: PlayerBase) {
        let index: number = this.playerList.indexOf(p);
        this.playerList.splice(index, 1)
        p.node.destroy();
    }

    /**
     * 初始化玩家操作ui
     */
    private initPlayerUI() {
        //初始化玩家操作Ui
        this.playerOperateUI = cc.instantiate(this.playerOperatePrefab).getComponent(PlayerOperatePrefab);
        this.container.addChild(this.playerOperateUI.node)
        this.playerOperateUI.node.active = false;
        //初始化玩家物品操作UI
        this.materialOperateUI = cc.instantiate(this.materialOperatePrefab).getComponent(MaterialOperateWheelPrefab);
        this.container.addChild(this.materialOperateUI.node)
        this.materialOperateUI.node.active = false;
        //初始化玩家法术操作UI
        this.magicOperateUI = cc.instantiate(this.magicOperatePrefab).getComponent(MagicOperateWheelPrefab);
        this.container.addChild(this.magicOperateUI.node)
        this.magicOperateUI.node.active = false;
        this.refreshPlayerOperateUI()
    }

    /**
     * 控制UI事件
     * @param keyType 
     */
    private onControlUIEvent(event: HaoEvent, keyType: number) {
        // Logger.log(this, "onControlUIEvent", keyType, LevelInfo.gameState)
        if (keyType == ControlUI_Event.A) {
            if (LevelInfo.gameState == GameState.Operate) {

            } else if (LevelInfo.gameState == GameState.Info) {
                this.checkLookPlayerInfo()
            } else if (LevelInfo.gameState == GameState.Walk) {
                let nowActionPlayer: PlayerBase = this.getNowActionPlayer();
                if (!nowActionPlayer.isEnemy) {
                    LevelInfo.gameState = GameState.Operate;
                    this.refresh()
                }
            }
        }
        else if (keyType == ControlUI_Event.B) {
            let nowActionPlayer: PlayerBase = this.getNowActionPlayer();
            if (!nowActionPlayer.isEnemy) {
                if (LevelInfo.gameState == GameState.Info) {
                    LevelInfo.gameState = GameState.Walk;
                    this.refresh()
                } else if (LevelInfo.gameState == GameState.Operate) {
                    LevelInfo.gameState = GameState.Walk;
                    this.refresh()
                } else if (LevelInfo.gameState == GameState.Walk) {
                    LevelInfo.gameState = GameState.Info;
                    this.refresh()
                } else if (LevelInfo.gameState == GameState.SelectItem) {
                    LevelInfo.gameState = GameState.Operate;
                    AttackGridManager.instatnce.clearGrid();
                    this.refresh()
                }
            }
        } else if (keyType == ControlUI_Event.C) {
            this.changeNowTilePlayer();
            this.showSimplePlayerInfo()
        } else if (keyType == ControlUI_Event.Up) {
            this.movePlayer(PlayerSide.Up)
            this.showSimplePlayerInfo()
        } else if (keyType == ControlUI_Event.Down) {
            this.movePlayer(PlayerSide.Down)
            this.showSimplePlayerInfo()
        } else if (keyType == ControlUI_Event.Left) {
            this.movePlayer(PlayerSide.Left)
            this.showSimplePlayerInfo()
        } else if (keyType == ControlUI_Event.Right) {
            this.movePlayer(PlayerSide.Right)
            this.showSimplePlayerInfo()
        }
    }


    /**
     * 刷新地图，玩家状态等
     */
    public refresh() {
        let nowActionPlayer: PlayerBase = this.getNowActionPlayer();
        if (!nowActionPlayer.isEnemy) {
            TileMapBase.instatnce.refreshGameState(); //更新地图选择框
            if (nowActionPlayer) {
                TileMapBase.instatnce.moveNowTile(nowActionPlayer.row, nowActionPlayer.col)
            }
            this.refreshPlayerWalkGrid(LevelInfo.nowActionPlayerId);
            this.refreshPlayerOperateUI()
            this.showSimplePlayerInfo()
        }
    }

    /**
     * 查看玩家详细信息
     */
    private checkLookPlayerInfo() {
        if (LevelInfo.gameState == GameState.Info) {
            let nowGrid: Grid = TileMapBase.instatnce.getNowTileGrid();
            let player: PlayerBase = this.getPlayerByRowCol(nowGrid.row, nowGrid.col);
            if (player) {
                if (player.isEnemy) {
                    // CommonTips.showMsg("只能查看自己人信息")
                } else {
                    LevelInfo.gameState = GameState.Dialog;
                    DialogPlayerInfo.show(player);
                }
            }
        }
    }

    /**
     * 查看玩家简单版信息 
    */
    private showSimplePlayerInfo(isShow: boolean = true) {
        this.simplePlayerInfoNode.node.active = false;
        if (LevelInfo.gameState == GameState.Info && isShow) {
            let nowGrid: Grid = TileMapBase.instatnce.getNowTileGrid();
            let player: PlayerBase = this.getPlayerByRowCol(nowGrid.row, nowGrid.col);
            if (player) {
                this.simplePlayerInfoNode.node.active = true;
                this.simplePlayerInfoNode.node.setPosition(player.node.x + 100, player.node.y)
                this.simplePlayerInfoNode.setInfo(player)
            }
        }
    }

    /**
     * 更改地图当前格子
     */
    private changeNowTilePlayer() {
        if (LevelInfo.gameState == GameState.Info) {
            let nowGrid: Grid = TileMapBase.instatnce.getNowTileGrid();
            let player: PlayerBase = this.getPlayerByRowCol(nowGrid.row, nowGrid.col);
            if (!player) {
                player = this.getPlayerById(LevelInfo.showActionPlayerId)
                TileMapBase.instatnce.moveNowTile(player.row, player.col)
            } else {
                player = this.getNextActionPlayer(LevelInfo.showActionPlayerId)
                LevelInfo.showActionPlayerId = player.id;
                if ((LevelInfo.isEnemyAction && player.isEnemy) || (!LevelInfo.isEnemyAction && !player.isEnemy)) {
                    LevelInfo.nowActionPlayerId = player.id;
                }
                if (player) {
                    TileMapBase.instatnce.moveNowTile(player.row, player.col)
                }
            }
        }
    }

    /**
     * 当前行列是否有其他人，有的话就不给你路过了
     * @param row 
     * @param col 
     */
    public isHaveOtherPlayer(row: number, col: number) {
        for (let i = 0; i < this.playerList.length; i++) {
            let player: PlayerBase = this.playerList[i];
            if (player.id != LevelInfo.nowActionPlayerId && player.row == row && player.col == col) {
                return true;
            }
        }
    }

    /**
     * 该行列是否有角色
     * @param row 
     * @param col 
     */
    public isHavePlayer(row: number, col: number) {
        for (let i = 0; i < this.playerList.length; i++) {
            let player: PlayerBase = this.playerList[i];
            if (player.row == row && player.col == col) {
                return true;
            }
        }
    }

    /**
     * 根据格子行列返回角色
     * @param row 
     * @param col 
     */
    public getPlayerByRowCol(row: number, col: number) {
        for (let i = 0; i < this.playerList.length; i++) {
            let player: PlayerBase = this.playerList[i];
            if (player.row == row && player.col == col) {
                return player;
            }
        }
    }

    /**
     * 根据当前关卡的playerId拿到角色对象
     * @param id 
     */
    private getPlayerById(id: number) {
        for (let i = 0; i < this.playerList.length; i++) {
            let player: PlayerBase = this.playerList[i];
            if (player.id == id) {
                return player;
            }
        }
    }

    /**
     * 获取当前玩家
     */
    public getNowActionPlayer() {
        let nowActionPlayer: PlayerBase = this.getPlayerById(LevelInfo.nowActionPlayerId)
        return nowActionPlayer;
    }

    /**
     * 返回下个action的player
     */
    private getNextActionPlayer(nowId: number) {
        let resultPlayer: PlayerBase = this.playerList[0];
        for (let i = 0; i < this.playerList.length; i++) {
            let player: PlayerBase = this.playerList[i]
            if (player.id == nowId) { 
                if (i != this.playerList.length - 1) {//最后一个是上次操作的玩家就轮到第一个
                    resultPlayer = this.playerList[i + 1]
                }
                break;
            }
        }
        return resultPlayer;
    }

    /**
     * 更换当前操作玩家
     */
    private changeNowActionPlayer() {
        let resultPlayer: PlayerBase = this.getNextActionPlayer(LevelInfo.nowActionPlayerId)
        LevelInfo.nowActionPlayerId = resultPlayer.id;
        LevelInfo.isEnemyAction = resultPlayer.isEnemy;
        TileMapBase.instatnce.refreshGameState(); //更新地图选择框
        let nowActionPlayer: PlayerBase = this.getNowActionPlayer();
        if (nowActionPlayer) {
            nowActionPlayer.initRow = nowActionPlayer.row;
            nowActionPlayer.initCol = nowActionPlayer.col;
            TileMapBase.instatnce.moveNowTile(nowActionPlayer.row, nowActionPlayer.col)
        }
        this.showSimplePlayerInfo()
        this.refreshPlayerWalkGrid(LevelInfo.nowActionPlayerId);
        this.refreshPlayerOperateUI()
    }

    /**
     * 玩家上下左右走
     * @param side ControlUI_Event.Up ControlUI_Event.Down ControlUI_Event.Left  ControlUI_Event.Right
     */
    private movePlayer(side: number) {
        if (LevelInfo.gameState == GameState.Walk) {
            let player: PlayerBase = this.getNowActionPlayer();
            if (!player.isEnemy) {
                player.moveSide(side)
            }
        }
    }

    /**
     * 刷新玩家可以走动的提示格子
     */
    private refreshPlayerWalkGrid(nowId: number) {
        let player: PlayerBase = this.getPlayerById(nowId);
        if (LevelInfo.gameState == GameState.Walk) {
            // WalkGridManager.instatnce.initWalkGrid(player.playerInfo.speed, player.row, player.col, player.isEnemy)
            WalkGridManager.instatnce.initWalkGrid(player.playerInfo.speed, player.initRow, player.initCol, player.isEnemy)
        } else {
            WalkGridManager.instatnce.clearWalkGrid();
        }
    }

    /**
     * 刷新玩家操作ui
     */
    private refreshPlayerOperateUI() {
        let nowGrid: Grid = TileMapBase.instatnce.getNowTileGrid();
        let player: PlayerBase = this.getPlayerByRowCol(nowGrid.row, nowGrid.col);
        this.playerOperateUI.node.active = false;
        if (player) {
            if (LevelInfo.gameState == GameState.Operate && player.id == LevelInfo.nowActionPlayerId && !player.isEnemy) {
                this.playerOperateUI.node.active = true;
                this.playerOperateUI.node.setPosition(player.node.getPosition())
            }
        }
    }

    /**
     * 玩家操作事件
     * @param playerOperate 
     */
    private onPlayerAction(event: HaoEvent, playerOperate: PlayerOperate) {
        Logger.log(this, "onPlayerAction=", playerOperate);
        let player: PlayerBase = this.getNowActionPlayer();
        if (playerOperate == PlayerOperate.defend) {
            this.onNextPlayerAction()
        } else if (playerOperate == PlayerOperate.attack) {
            if (this.checkInitAttackGrid(player)) {
                LevelInfo.gameState = GameState.SelectItem;
            } else {
                CommonTips.showMsg("没有攻击目标哦!")
            }
        } else if (playerOperate == PlayerOperate.magic) {
            this.playerOperateUI.node.active = false;
            this.magicOperateUI.node.active = true;
            this.magicOperateUI.node.setPosition(player.node.getPosition());
            this.magicOperateUI.initMaterial(player.playerInfo.magic)
        } else if (playerOperate == PlayerOperate.material) {
            this.playerOperateUI.node.active = false;
            this.materialOperateUI.node.active = true;
            this.materialOperateUI.node.setPosition(player.node.getPosition())
            this.materialOperateUI.initMaterial(player.playerInfo.bodyMaterial)
        }
    }

    /**
     * 选择物品
     * @param index 
     */
    private onPlayerMaterialAction(event: HaoEvent, index: number) {
        Logger.log(this, "onPlayerMaterialAction===", index)
    }

    /**
     * 到下个玩家操作
     */
    public onNextPlayerAction() {
<<<<<<< HEAD
        Logger.log(this,"到下个玩家操作==")
=======
        Logger.log(this, "到下个玩家操作==")
>>>>>>> 88bb3cb2c4705917ae5138d6548cf1cb50e017f4
        let nowActionPlayer: PlayerBase = this.getNowActionPlayer()
        LevelInfo.gameState = GameState.Walk;
        this.changeNowActionPlayer();
        if (LevelInfo.isEnemyAction) {//到敌人行动
            nowActionPlayer = this.getNowActionPlayer()
            if (nowActionPlayer) {
                for (let i = 0; i < this.playerList.length; i++) {
                    let tempPlayer: PlayerBase = this.playerList[i];
                    let moveGridList: Array<Grid> = []
                    if (!tempPlayer.isEnemy) { //我们的角色
                        let distance: number = Math.abs(nowActionPlayer.row - tempPlayer.row) + Math.abs(nowActionPlayer.col - tempPlayer.col)
                        if (distance <= nowActionPlayer.playerInfo.attackRange) { //敌人只会走到可以攻击的位置就停下来

                        } else {
                            LevelInfo.gameState = GameState.Walk;
                            this.refreshPlayerWalkGrid(LevelInfo.nowActionPlayerId)
                            if (nowActionPlayer.levelStep <= LevelInfo.levelStep) {
                                moveGridList = TileMapBase.instatnce.getWalkRoad(nowActionPlayer.row, nowActionPlayer.col, tempPlayer.row, tempPlayer.col, nowActionPlayer.playerInfo.speed, nowActionPlayer.playerInfo.attackRange)
                            } else {
                                moveGridList = [];
                            }
                            this.showSimplePlayerInfo(false);
                        }
                        this.moveByGridList(moveGridList, nowActionPlayer)
                        break;
                    }
                }
            }
        }
    }

    /**
     * 根据格子队列按顺序移动角色(一般用于敌人搜索可走路径后自动走路)
     * @param moveGridList 
     * @param player 
     */
    private moveByGridList(moveGridList: Array<Grid>, player: PlayerBase) {
        let grid: Grid = moveGridList.shift();
        if (grid) {
            player.moveToRowCol(grid.row, grid.col);
            this.scheduleOnce(() => {
                this.moveByGridList(moveGridList, player)
            }, 0.5);
        } else { //敌人走完了
            // CommonTips.showMsg("敌人走完了")
            if (this.checkInitAttackGrid(player)) {
                AttackGridManager.instatnce.tryAttack();
            } else {
                this.onNextPlayerAction();
            }
        }
    }

    /**
     * 尝试初始化显示攻击区域
     * @param player 
     */
    private checkInitAttackGrid(player: PlayerBase) {
        let attackGridList: Array<Grid> = AttackGridManager.instatnce.getAttackGridList(player.playerInfo.attackRange, player.row, player.col);
        if (attackGridList.length > 0) { //攻击区域有敌人
            this.playerOperateUI.node.active = false;
            AttackGridManager.instatnce.initAttackGrid(player.playerInfo.attackRange, player.row, player.col, player.isEnemy);
            return true;
        } else {
            return false;
        }
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
        PlayerManager.instatnce = null;
        EventManager.instance.removeListener(GameEvent.Event_Player_Action, this.onPlayerAction)
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
        EventManager.instance.removeListener(GameEvent.Event_Player_Material_Action, this.onPlayerMaterialAction);
    }

}
