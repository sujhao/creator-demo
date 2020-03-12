import { Logger } from "../../engine/utils/Logger";
import LevelConfig from "../model/LevelConfig";
import LevelInfo from "../model/LevelInfo";
import Grid from "../../engine/utils/Grid";
import EventManager, { HaoEvent } from "../../engine/utils/EventManager";
import ControlUI, { ControlUI_Event } from "../prefab/ControlUI";
import { PlayerSide } from "../model/PlayerType";
import { MoveHelper } from "../../engine/utils/MoveHelper";
import AdapterHelper from "../../engine/utils/AdapterHelper";
import { GameState } from "../model/GameState";
import PlayerManager from "../players/PlayerManager";
import MathUtils from "../../engine/utils/MathUtils";
import RandomUtil from "../../engine/utils/RandomUtil";
import { Astar, AstarGridType } from "../uicomponent/Astar";
import GiftManager from "../manager/GiftManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TileMapBase extends cc.Component {

    public static instatnce: TileMapBase = null;

    @property({ type: cc.Node })
    private selectNode: cc.Node = null;

    private nowTile: Grid = new Grid(5, 3)  //当前地图哪个格子
    private tileMap: cc.TiledMap;
    private mapLeft: number = 0;         //地图显示最左边时x
    private mapRight: number = 0;        //地图显示最右边时x
    private mapDown: number = 0;         //地图显示最下面时y
    private mapUp: number = 0;           //地图显示最上面时Y
    public mapSize: cc.Size;           //地图大小,格子数量
    private tileSize: cc.Size;          //格子大小
    private isMovingMap: boolean = false;   //是否在移动地图
    private isMovingSelectNode: boolean = false;   //是否在移动选择框
    public speed: number = 20;

    private selectNodeTx: number;
    private selectNodeTy: number;
    private mapNeedX: number;
    
    private mapNeedY: number;
    public wallList: Array<Array<number>> = [];


    // public astar:Astar;

    onLoad() {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        TileMapBase.instatnce = this;
    }

    /**
     * 地图初始化
     */
    public init(){
        this.tileMap = this.node.getComponent(cc.TiledMap);
        this.mapSize = this.tileMap.getMapSize();
        this.tileSize = this.tileMap.getTileSize();
        Logger.log(this,"tilemap======", this.mapSize, this.tileSize)
        let designsize: cc.Size = cc.view.getDesignResolutionSize();
        this.mapLeft = Math.min(-designsize.width / 2, -AdapterHelper.winSizeWidth / 2); //当屏幕大过设计分辨率宽时地图最左边应该是屏幕最左边
        if (designsize.width > this.mapSize.width * this.tileSize.width) { //当设计分辨率宽大过地图时
            this.mapRight = this.mapLeft;
        } else {
            //当屏幕大过设计分辨率宽时地图最右边应该是屏幕最右边
            this.mapRight = -this.mapSize.width * this.tileSize.width + Math.max(AdapterHelper.winSizeWidth / 2, designsize.width / 2);
        }
        this.mapDown = -designsize.height / 2 + this.mapSize.height * this.tileSize.height;
        if (designsize.height > this.mapSize.height * this.tileSize.height) { //当设计分辨率高大过地图时
            this.mapUp = this.mapDown;
        } else {
            this.mapUp = designsize.height / 2;
        }
        this.refreshGameState()
        // this.astar = new Astar();
        // this.astar.init(this.mapSize.width, this.mapSize.height);
        let wallLayer: cc.TiledLayer = this.tileMap.getLayer("wall");
        for (let i = 0; i < this.mapSize.height; i++) {
            this.wallList[i] = [];
            for (let j = 0; j < this.mapSize.width; j++) {
                let wallGrid: number = wallLayer.getTileGIDAt(cc.v2(j, i)) //这里要注意tilemap的行列跟人类是相反的
                this.wallList[i][j] = wallGrid;
                if(wallGrid > 0){
                    // this.astar.setGridType(j, i, AstarGridType.Hider)
                }else{
                    // this.astar.setGridType(j, i, AstarGridType.Normal)
                }
            }
        }
    }


    /**
     * 创建返回一个a星搜索对象
     */
    public createMapAstar(){
        let astar:Astar = new Astar();
        astar.init(this.mapSize.width, this.mapSize.height);
        for (let i = 0; i < this.mapSize.height; i++) {
            for (let j = 0; j < this.mapSize.width; j++) {
                if(this.wallList[i][j] > 0 || PlayerManager.instatnce.isHavePlayer(i, j)){
                    astar.setGridType(j, i, AstarGridType.Hider)
                }else{
                    astar.setGridType(j, i, AstarGridType.Normal)
                }
            }
        }

        return astar;
    }


    /**
     * 当前行列格子是否可以行走
     * @param row 
     * @param col 
     */
    public canWalk(row: number, col: number) {
        if (row < 0 || row >= this.wallList.length) {
            return false;
        }
        if (col < 0 || col >= this.wallList[0].length) {
            return false;
        }

        if (this.wallList[row][col] > 0 || PlayerManager.instatnce.isHaveOtherPlayer(row, col) || !GiftManager.instatnce.canWalk(row, col)) { //格子不给走或者格子有人了
            return false;
        }
        return true;
    }

    private onControlUIEvent(event:HaoEvent,keyType: number) {
        Logger.log(this,"tilemap controlui=", keyType)
        if (keyType == ControlUI_Event.Up) {
            this.checkMoveMap(PlayerSide.Up);
        } else if (keyType == ControlUI_Event.Down) {
            this.checkMoveMap(PlayerSide.Down);
        } else if (keyType == ControlUI_Event.Left) {
            this.checkMoveMap(PlayerSide.Left);
        } else if (keyType == ControlUI_Event.Right) {
            this.checkMoveMap(PlayerSide.Right);
        }
    }

    public getNowTileGrid(): Grid {
        return this.nowTile;
    }

    /**
     * 地图相关元素要根据游戏状态更新，例如GameState.Info查看信息状态的话，当前地图选择框要隐藏
     */
    public refreshGameState() {
        if (LevelInfo.gameState == GameState.Info) {
            this.selectNode.active = true;
        } else {
            this.selectNode.active = false;
        }
    }


    /**
     * 根据选择框移动地图位置使选择框位于屏幕中间
     * @param side 

     */
    public checkMoveMap(side: number) {
        if(LevelInfo.gameState == GameState.Info){
            if (this.isMovingMap || this.isMovingSelectNode) return;
            if (side == PlayerSide.Up) {
                if (this.nowTile.row > 0) {
                    this.nowTile.row -= 1;
                    this.moveNowTile(this.nowTile.row, this.nowTile.col)
                }
            } else if (side == PlayerSide.Down) {
                if (this.nowTile.row < this.mapSize.height - 1) {
                    this.nowTile.row += 1;
                    this.moveNowTile(this.nowTile.row, this.nowTile.col)
                }
            } else if (side == PlayerSide.Left) {
                if (this.nowTile.col > 0) {
                    this.nowTile.col -= 1;
                    this.moveNowTile(this.nowTile.row, this.nowTile.col)
                }
            } else if (side == PlayerSide.Right) {
                if (this.nowTile.col < this.mapSize.width - 1) {
                    this.nowTile.col += 1;
                    this.moveNowTile(this.nowTile.row, this.nowTile.col)
                }
            }
        }
    }

    /**
     * 移动选择框
     * @param row 
     * @param col 
     */
    public moveNowTile(row: number, col: number) {
        this.nowTile.row = row;
        this.nowTile.col = col;
        this.selectNodeTx = this.nowTile.col * this.tileSize.width + this.tileSize.width / 2;
        this.selectNodeTy = -this.nowTile.row * this.tileSize.height - this.tileSize.height / 2;
        this.mapNeedX = -this.selectNodeTx;
        this.mapNeedY = -this.selectNodeTy;
        this.refreshNowTile();
    }


    /**
     * 更新当前选择框位置
     */
    private refreshNowTile() {
        this.selectNodeTx = this.nowTile.col * this.tileSize.width + this.tileSize.width / 2;
        this.selectNodeTy = -this.nowTile.row * this.tileSize.height - this.tileSize.height / 2;
        this.selectNode.setPosition(this.selectNodeTx, this.selectNodeTy);
        this.mapNeedX = -this.selectNodeTx;
        this.mapNeedY = -this.selectNodeTy;
        this.selectNode.getChildByName("txtInfo").getComponent(cc.Label).string = this.nowTile.row + "," + this.nowTile.col
    }

    /**
     * 刷新地图边界
     */
    private refreshMapSide() {
        if (this.mapNeedX > this.mapLeft) {
            this.mapNeedX = this.mapLeft;
        }
        else if (this.mapNeedX < this.mapRight) {
            this.mapNeedX = this.mapRight;
        }
        if (this.mapNeedY > this.mapDown) {
            this.mapNeedY = this.mapDown;
        } else if (this.mapNeedY < this.mapUp) {
            this.mapNeedY = this.mapUp;
        }
        if (this.tileMap.node.x > this.mapLeft) { //地图来到我们的最左边
            this.tileMap.node.x = this.mapLeft;
            this.isMovingMap = false;
        } else if (this.tileMap.node.x < this.mapRight) { //地图来到我们的最右边
            this.tileMap.node.x = this.mapRight;
            this.isMovingMap = false;
        }
        if (this.tileMap.node.y > this.mapDown) {//地图来到最下面
            this.tileMap.node.y = this.mapDown;
            this.isMovingMap = false;
        } else if (this.tileMap.node.y < this.mapUp) {
            this.tileMap.node.y = this.mapUp;
            this.isMovingMap = false;
        }
    }
    //移动选中框
    private moveSelectNode() {
        this.isMovingSelectNode = MoveHelper.moveNode(this.selectNode, this.speed, this.selectNodeTx, this.selectNodeTy)
    }

    /**
     * 移动地图
     */
    private moveMap() {
        this.isMovingMap = MoveHelper.moveNode(this.tileMap.node, this.speed, this.mapNeedX, this.mapNeedY)
        this.refreshMapSide();
    }

    update() {
        this.moveSelectNode();
        this.moveMap();
    }

    /**
     * 根据行列获取格子位置
     * @param row 
     * @param col 
     */
    public getTileGlobalLocationByRowCol(row: number, col: number):cc.Vec2 {
        let tx: number = col * this.tileSize.width + this.tileSize.width / 2;
        let ty: number = -row * this.tileSize.height - this.tileSize.height / 2;
        return cc.v2(tx, ty)
    }


    public getWalkRoad(startRow: number, startCol: number, endRow: number, endCol: number, step: number, attackRange: number) {
        let result: Array<Grid> = []
        this.searchRoad(startRow, startCol, endRow, endCol, step, result)
        let newResult: Array<Grid> = [];
        for (let i = 0; i < result.length; i++) {
            let tempGrid: Grid = result[i];
            let distance: number = Math.abs(tempGrid.row - endRow) + Math.abs(tempGrid.col - endCol)
            newResult.push(tempGrid)
            if (distance <= attackRange) { //敌人只会走到可以攻击的位置就停下来
                break;
            }
        }
        return newResult;
    }

    //人工智能搜索行走路径
    private searchRoad(startRow: number, startCol: number, endRow: number, endCol: number, step: number, result: Array<Grid>) {
        let grid: Grid = null;
        let nextBool: boolean = RandomUtil.nextBoolean();
        if (endRow == startRow) { //同一行
            if (endCol > startCol) { //向右走
                if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                    grid = Grid.init(startRow, startCol + 1);
                    result.push(grid)
                }
            } else if (endCol < startCol) { ////向左走
                if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                    grid = Grid.init(startRow, startCol - 1)
                    result.push(grid)
                }
            }
        } else if (endCol == startCol) { //同一列
            if (endRow > startRow) { //向下走
                if (this.canWalk(startRow + 1, startCol)) { //向下走有路
                    grid = Grid.init(startRow + 1, startCol)
                    result.push(grid)
                }
            } else if (endRow < startRow) { //向上走
                if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                    grid = Grid.init(startRow - 1, startCol)
                    result.push(grid)
                }
            }
        } else {
            if (endRow < startRow && endCol > startCol) { //右上角
                if (nextBool) {
                    if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                        grid = Grid.init(startRow, startCol + 1)
                        result.push(grid)
                    } else if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                        grid = Grid.init(startRow - 1, startCol)
                        result.push(grid)
                    }
                } else {
                    if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                        grid = Grid.init(startRow - 1, startCol)
                        result.push(grid)
                    } else if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                        grid = Grid.init(startRow, startCol + 1)
                        result.push(grid)
                    }

                }

            } else if (endRow > startRow && endCol > startCol) {//右下角
                if (nextBool) {
                    if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                        grid = Grid.init(startRow, startCol + 1)
                        result.push(grid)
                    } else if (this.canWalk(startRow + 1, startCol)) { //向下走有路
                        grid = Grid.init(startRow + 1, startCol)
                        result.push(grid)
                    }
                } else {
                    if (this.canWalk(startRow + 1, startCol)) { //向下走有路
                        grid = Grid.init(startRow + 1, startCol)
                        result.push(grid)
                    } else if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                        grid = Grid.init(startRow, startCol + 1)
                        result.push(grid)
                    }
                }
            } else if (endRow < startRow && endCol < startCol) { //左上角
                if (nextBool) {
                    if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                        grid = Grid.init(startRow, startCol - 1)
                        result.push(grid)
                    } else if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                        grid = Grid.init(startRow - 1, startCol)
                        result.push(grid)
                    }
                } else {
                    if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                        grid = Grid.init(startRow - 1, startCol)
                        result.push(grid)
                    } else if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                        grid = Grid.init(startRow, startCol - 1)
                        result.push(grid)
                    }

                }
            } else if (endRow > startRow && endCol < startCol) {//左下角
                if (nextBool) {
                    if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                        grid = Grid.init(startRow, startCol - 1)
                        result.push(grid)
                    } else if (this.canWalk(startRow + 1, startCol)) { //向下走有路
                        grid = Grid.init(startRow + 1, startCol)
                        result.push(grid)
                    }
                } else {
                    if (this.canWalk(startRow + 1, endCol)) { //向下走有路
                        grid = Grid.init(startRow + 1, startCol)
                        result.push(grid)
                    } else if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                        grid = Grid.init(startRow, startCol - 1)
                        result.push(grid)
                    }
                }
            }
        }
        if (!grid) { //稍稍优秀的寻路是有解的
            let randomNum: number = RandomUtil.nextInt(0, 3)
            if (randomNum == 0) {
                if (this.canWalk(startRow + 1, startCol)) { //向下走有路
                    grid = Grid.init(startRow + 1, startCol)
                    result.push(grid)
                } else if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                    grid = Grid.init(startRow - 1, startCol)
                    result.push(grid)
                } else if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                    grid = Grid.init(startRow, startCol - 1)
                    result.push(grid)
                } else if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                    grid = Grid.init(startRow, startCol + 1)
                    result.push(grid)
                }
            } else if (randomNum == 1) {
                if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                    grid = Grid.init(startRow - 1, startCol)
                    result.push(grid)
                } else if (this.canWalk(startRow + 1, startCol)) { //向下走有路
                    grid = Grid.init(startRow + 1, startCol)
                    result.push(grid)
                } else if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                    grid = Grid.init(startRow, startCol - 1)
                    result.push(grid)
                } else if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                    grid = Grid.init(startRow, startCol + 1)
                    result.push(grid)
                }
            } else if (randomNum == 2) {
                if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                    grid = Grid.init(startRow, startCol - 1)
                    result.push(grid)
                } else if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                    grid = Grid.init(startRow, startCol + 1)
                    result.push(grid)
                } else if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                    grid = Grid.init(startRow - 1, startCol)
                    result.push(grid)
                } else if (this.canWalk(startRow + 1, startCol)) { //向下走有路
                    grid = Grid.init(startRow + 1, startCol)
                    result.push(grid)
                }
            } else {
                if (this.canWalk(startRow, startCol + 1)) { ////向右走有路
                    grid = Grid.init(startRow, startCol + 1)
                    result.push(grid)
                } else if (this.canWalk(startRow, startCol - 1)) { ////向左走有路
                    grid = Grid.init(startRow, startCol - 1)
                    result.push(grid)
                } else if (this.canWalk(startRow - 1, startCol)) { //向上走有路
                    grid = Grid.init(startRow - 1, startCol)
                    result.push(grid)
                } else if (this.canWalk(startRow + 1, startCol)) { //向下走有路
                    grid = Grid.init(startRow + 1, startCol)
                    result.push(grid)
                }
            }
        }
        if (!grid) {
            Logger.log(this,"无路可走了", result)
        } else {
            step--;
            if (step > 0) {
                this.searchRoad(grid.row, grid.col, endRow, endCol, step, result)
            } else {
            }
        }
    }

    onDestroy() {
        TileMapBase.instatnce = null;
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }

}


