import Grid from "../../engine/utils/Grid";
import { GameState } from "../model/GameState";
import LevelInfo from "../model/LevelInfo";
import MoveGridPrefab from "../prefab/MoveGridPrefab";
import ResourcePrefab from "../prefab/ResourcePrefab";
import TileMapBase from "../tilemap/TileMapBase";
import { Logger } from "../../engine/utils/Logger";
import { Astar, AstarGridType, AstarGrid } from "../uicomponent/Astar";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WalkGridManager extends cc.Component {

    @property({ type: cc.Node })
    private walkGridContainer: cc.Node = null;

    public static instatnce: WalkGridManager = null;

    private nowWalkGridList: Array<Grid> = [];

    private nowWalkNodeList: Array<cc.Node> = [];

    onLoad() {
        WalkGridManager.instatnce = this;
    }

    /**
     * 初始化行走区域格子
     * @param speed 
     * @param row 
     * @param col 
     */
    public initWalkGrid(speed: number, row: number, col: number, isEnemy: boolean) {
        if (LevelInfo.gameState == GameState.Walk) {
            this.walkGridContainer.removeAllChildren();

            this.nowWalkGridList = [];
            for (let i = col - speed; i <= col + speed; i++) {
                for (let j = row - speed; j <= row + speed; j++) {
                    if (j >= 0 && j < TileMapBase.instatnce.mapSize.height && i >= 0 && i < TileMapBase.instatnce.mapSize.width) {
                        if (row == j && col == i) { //自己的格子
                            this.createWalkGrid(j, i, isEnemy)
                        } else {
                            if (TileMapBase.instatnce.canWalk(j, i)) { //格子能走才判断距离
                                let distance: number = Math.abs(i - col) + Math.abs(j - row);
                                if (distance <= speed) {
                                    this.createWalkGrid(j, i, isEnemy)
                                }
                            }
                        }
                    }
                }
            }
            for(let i=this.nowWalkGridList.length-1; i>=0; i--){
                let grid: Grid = this.nowWalkGridList[i];
                if (grid.row != row || grid.col != col) {
                    let astar: Astar = TileMapBase.instatnce.createMapAstar();
                    astar.setGridType(col, row, AstarGridType.End);
                    astar.findPath(cc.v2(grid.col, grid.row), cc.v2(col, row), (path: Array<AstarGrid>) => {
                        if (path.length > 0) { //有路

                        } else {

                            this.removeWalkGrid(grid.row, grid.col)
                        }
                    });
                }

            }
        }
    }

    /**
     * 创建可以行走的格子视图
     * @param row 
     * @param col 
     * @param isEnemy 是否敌人，敌人的话格子会长不同样子
     */
    private createWalkGrid(row: number, col: number, isEnemy: boolean) {
        this.nowWalkGridList.push(new Grid(row, col))
        let prefab: cc.Prefab = ResourcePrefab.getMoveGridPrefab();
        let grid: cc.Node = cc.instantiate(prefab);
        if (isEnemy) {
            grid.color = cc.Color.RED;
        }
        this.walkGridContainer.addChild(grid);
        grid.getComponent(MoveGridPrefab).row = row;
        grid.getComponent(MoveGridPrefab).col = col;
        grid.setPosition(TileMapBase.instatnce.getTileGlobalLocationByRowCol(row, col))
        this.nowWalkNodeList.push(grid)
    }

    /**
     * 移除掉行列的行走视图格子
     * @param row 
     * @param col 
     */
    private removeWalkGrid(row: number, col: number) {
        for (let i = 0; i < this.nowWalkGridList.length; i++) {
            let grid: Grid = this.nowWalkGridList[i];
            if (grid.row == row && grid.col == col) {
                this.nowWalkGridList.splice(i, 1)
                let node: cc.Node = this.nowWalkNodeList[i];
                node.destroy();
                this.nowWalkNodeList.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 清除当前所有可行走显示格子
     */
    public clearWalkGrid() {
        this.nowWalkGridList = [];
        this.nowWalkNodeList = [];
        this.walkGridContainer.removeAllChildren()
    }

    /**
     * 判断当前行列是否有行走显示格子
     * @param row 
     * @param col 
     */
    public canWalk(row: number, col: number) {
        for (let i = 0; i < this.nowWalkGridList.length; i++) {
            let grid: Grid = this.nowWalkGridList[i];
            if (grid.row == row && grid.col == col) {
                return true;
            }
        }
        return false;
    }

    onDestroy() {
        WalkGridManager.instatnce = null;
    }
}
