import { MoveHelper } from "../../engine/utils/MoveHelper";
import PlayerInfo from "../model/PlayerInfo";
import { PlayerSide } from "../model/PlayerType";
import TileMapBase from "../tilemap/TileMapBase";
import WalkGridManager from "../manager/WalkGridManager";
import { Logger } from "../../engine/utils/Logger";
import AttackGridManager from "../manager/AttackGridManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerBase extends cc.Component {

    @property({ type: cc.Node })
    private leftMv: cc.Node = null;  //玩家向左走的动画

    @property({ type: cc.Node })
    private rightMv: cc.Node = null; //玩家向右走的动画

    @property({ type: cc.Node })
    private downMv: cc.Node = null;  //玩家向下走的动画

    @property({ type: cc.Node })
    private upMv: cc.Node = null;  //玩家向上走的动画

    @property({ type: cc.Animation })
    private attackRightMv: cc.Animation = null;

    @property({ type: cc.Animation })
    private attackLeftMv: cc.Animation = null;

    @property({ type: cc.Animation })
    private attackUpMv: cc.Animation = null;

    @property({ type: cc.Animation })
    private attackDownMv: cc.Animation = null;



    public id: number = 0;    //玩家Id,游戏里每关是不同的
    public initRow: number = 0; //玩家行动时所在格子行
    public initCol: number = 0; //玩家行动时所在格子列
    public row: number = 0;  //玩家当前所在格子行
    public col: number = 0; //玩家当前所在的格子列

    public playerInfo: PlayerInfo = null; //角色专属信息

    public life: number = 0; //身上的血量
    public power: number = 0; //身上的法力

    public isEnemy: boolean = false; //是否敌人
    private isMoving: boolean = false;  //玩家是否在移动

    private playerMoveSpeed: number = 20;   //玩家移动速度
    private nowLocation: cc.Vec2 = cc.v2(0, 0)   //玩家当前位置


    public levelStep: number = 1;

    /**
     * 设置玩家当前所在行列
     * @param row 
     * @param col 
     */
    public setRowCol(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.initRow = row;
        this.initCol = col;
        this.node.setPosition(TileMapBase.instatnce.getTileGlobalLocationByRowCol(row, col))
        this.nowLocation = TileMapBase.instatnce.getTileGlobalLocationByRowCol(this.row, this.col);
    }

    /**
    * 玩家上下左右走
    * @param side ControlUI_Event.Up ControlUI_Event.Down ControlUI_Event.Left  ControlUI_Event.Right
    */
    public moveSide(side: number) {
        let wantRow: number = this.row;
        let wantCol: number = this.col;
        if (side == PlayerSide.Down) {
            wantRow += 1;
            if (wantRow >= TileMapBase.instatnce.mapSize.height) {
                wantRow = TileMapBase.instatnce.mapSize.height - 1;
            }
        } else if (side == PlayerSide.Up) {
            wantRow -= 1;
            if (wantRow < 0) {
                wantRow = 0;
            }
        } else if (side == PlayerSide.Left) {
            wantCol -= 1;
            if (wantCol < 0) {
                wantCol = 0;
            }
        } else if (side == PlayerSide.Right) {
            wantCol += 1;
            if (wantCol >= TileMapBase.instatnce.mapSize.width) {
                wantCol = TileMapBase.instatnce.mapSize.width - 1;
            }
        }
        if (!this.isMoving && WalkGridManager.instatnce.canWalk(wantRow, wantCol)) {
            this.moveToRowCol(wantRow, wantCol)
        }
    }

    /**
     * 移动玩家到行列
     * @param wantRow 
     * @param wantCol 
     */
    public moveToRowCol(wantRow: number, wantCol: number) {
        if (this.row > wantRow) {//向上移动
            this.setSide(PlayerSide.Up);
        } else if (this.row < wantRow) { //向下移动
            this.setSide(PlayerSide.Down);
        } else if (this.col < wantCol) { //向右移动
            this.setSide(PlayerSide.Right)
        } else if (this.col > wantCol) { //向左移动
            this.setSide(PlayerSide.Left)
        }
        this.row = wantRow;
        this.col = wantCol;
        TileMapBase.instatnce.moveNowTile(wantRow, wantCol)
        this.nowLocation = TileMapBase.instatnce.getTileGlobalLocationByRowCol(this.row, this.col);
    }

    /**
     * 玩家在走动时设置玩家方向动画
     * @param side PlayerSide.ts
     */
    public setSide(side: number = 0) {
        this.hideAll();
        this.leftMv.active = false;
        this.leftMv.getComponent(cc.Animation).stop()
        this.rightMv.active = false;
        this.rightMv.getComponent(cc.Animation).stop()
        this.downMv.active = false;
        this.downMv.getComponent(cc.Animation).stop()
        this.upMv.active = false;
        this.upMv.getComponent(cc.Animation).stop()
        if (side == PlayerSide.Down) {
            this.downMv.active = true;
            this.downMv.getComponent(cc.Animation).play();
        } else if (side == PlayerSide.Up) {
            this.upMv.active = true;
            this.upMv.getComponent(cc.Animation).play()
        }
        else if (side == PlayerSide.Left) {
            this.leftMv.active = true;
            this.leftMv.getComponent(cc.Animation).play()
        }
        else if (side == PlayerSide.Right) {
            this.rightMv.active = true;
            this.rightMv.getComponent(cc.Animation).play()
        }
    }

    /**
     * 玩家每帧移动
     */
    private movePlayer() {
        this.isMoving = MoveHelper.moveNode(this.node, this.playerMoveSpeed, this.nowLocation.x, this.nowLocation.y)
    }

    update() {
        this.movePlayer();
    }

    /**
     * 隐藏角色所有动画
     */
    private hideAll() {
        this.leftMv.active = false;
        this.rightMv.active = false;
        this.upMv.active = false;
        this.downMv.active = false;

        if (this.attackDownMv) {
            this.attackDownMv.node.active = false
        }
        if (this.attackRightMv) {
            this.attackRightMv.node.active = false;
        }
        if (this.attackLeftMv) {
            this.attackLeftMv.node.active = false;
        }
        if (this.attackUpMv) {
            this.attackUpMv.node.active = false;
        }
    }


    /**
     * 播放角色普通攻击动画
     * @param side 攻击方向
     */
    public playAttack(side: number) {
        this.hideAll();
        let attackMv: cc.Animation;
        if (side == PlayerSide.Down) {
            attackMv = this.attackDownMv;
        } else if (side == PlayerSide.Up) {
            attackMv = this.attackUpMv;
        } else if (side == PlayerSide.Left) {
            attackMv = this.attackLeftMv;
        } else if (side == PlayerSide.Right) {
            attackMv = this.attackRightMv;
        }
        attackMv.node.active = true;
        let clip: cc.AnimationClip = attackMv.getClips()[0]
        attackMv.play(clip.name);
        this.scheduleOnce(() => {
            this.setSide(side)
        }, clip.duration);
        AttackGridManager.instatnce.clearGrid();
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
    }
}
