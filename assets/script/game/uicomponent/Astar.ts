import { Logger } from "../../engine/utils/Logger";

const { ccclass, property } = cc._decorator;

export enum AstarGridType {
    Hider = 0, //不能走
    Normal = 1, //能走
    End = 2 //终点
}

export class AstarGrid {
    public x: number = 0;
    public y: number = 0;
    public f: number = 0;
    public g: number = 0;
    public h: number = 0;
    public type: number = 0
    public parent: AstarGrid = null;
}

@ccclass
export class Astar extends cc.Component {

    public mapW: number = 24;   // 横向格子数量
    public mapH: number = 13; // 纵向格子数量
    public is8dir: boolean = false // 是否8方向寻路   //4方向:代表只能走上下左右 8方向:代表可以走上下左右，左上，右上，左下，右下

    private openList: Array<AstarGrid> = [];
    private closeList: Array<AstarGrid> = [];
    private path: Array<AstarGrid> = [];
    private gridsList: Array<Array<AstarGrid>> = []

    onLoad() {
    }

    /**
     * @param mapW 宽格子数
     * @param mapH 高格子数
     * @param is8dir 是8方向(上，下，左，右，左上，右上，左下，右下)寻路还是4方向(上，下，左，右)
     */
    public init(mapW: number, mapH: number, is8dir: boolean = false) {
        this.mapW = mapW;
        this.mapH = mapH;
        this.is8dir = is8dir;
        this.initMap()
    }

    /**
     * 初始化map的格子
     */
    private initMap() {
        this.openList = [];
        this.closeList = [];
        this.path = [];
        // 初始化格子二维数组
        this.gridsList = new Array(this.mapW + 1);
        for (let col = 0; col < this.gridsList.length; col++) {
            this.gridsList[col] = new Array(this.mapH + 1);
        }
        for (let col = 0; col <= this.mapW; col++) {
            for (let row = 0; row <= this.mapH; row++) {
                this.addGrid(col, row, AstarGridType.Normal);
            }
        }
    }


    /**
     * 创建一个格子到地图
     * @param x 
     * @param y 
     * @param type 
     */
    private addGrid(x: number, y: number, type: number = AstarGridType.Hider) {
        let grid = new AstarGrid();
        grid.x = x;
        grid.y = y;
        grid.type = type;
        this.gridsList[x][y] = grid;
    }

    /**
     * 设置格子类型
     * @param x 
     * @param y 
     * @param type 
     */
    public setGridType(x: number, y: number, type: number) {
        let curGrid: AstarGrid = this.gridsList[x][y]
        curGrid.type = type;
    }

    /**
     * 开始搜索路径
     * @param startPos  
     * @param endPos 
     */
    public findPath(startPos: cc.Vec2, endPos: cc.Vec2, callback: Function = null) {
        let startGrid = this.gridsList[startPos.x][startPos.y];
        this.openList.push(startGrid);
        let curGrid: AstarGrid = this.openList[0];
        while (this.openList.length > 0 && curGrid.type != AstarGridType.End) {
            // 每次都取出f值最小的节点进行查找
            curGrid = this.openList[0];
            if (curGrid.type == AstarGridType.End) {
                // Logger.log(this,"find path success.");
                this.generatePath(curGrid);
                if (callback) {
                    callback(this.path)
                }
                return;
            }

            for (let i: number = -1; i <= 1; i++) {
                for (let j: number = -1; j <= 1; j++) {
                    if (i != 0 || j != 0) {
                        let col = curGrid.x + i;
                        let row = curGrid.y + j;
                        if (col >= 0 && row >= 0 && col <= this.mapW && row <= this.mapH
                            && this.gridsList[col][row].type != AstarGridType.Hider
                            && this.closeList.indexOf(this.gridsList[col][row]) < 0) {
                            if (this.is8dir) {
                                // 8方向 斜向走动时要考虑相邻的是不是障碍物
                                if (this.gridsList[col - i][row].type == AstarGridType.Hider || this.gridsList[col][row - j].type == AstarGridType.Hider) {
                                    continue;
                                }
                            } else {
                                // 四方形行走
                                if (Math.abs(i) == Math.abs(j)) {
                                    continue;
                                }
                            }
                            // 计算g值
                            let g = curGrid.g + Math.floor(Math.sqrt(Math.pow(i * 10, 2)) + Math.pow(j * 10, 2))
                            if (this.gridsList[col][row].g == 0 || this.gridsList[col][row].g > g) {
                                this.gridsList[col][row].g = g;
                                // 更新父节点
                                this.gridsList[col][row].parent = curGrid;
                            }
                            // 计算h值 manhattan估算法
                            this.gridsList[col][row].h = Math.abs(endPos.x - col) + Math.abs(endPos.y - row);
                            // 更新f值
                            this.gridsList[col][row].f = this.gridsList[col][row].g + this.gridsList[col][row].h;
                            // 如果不在开放列表里则添加到开放列表里
                            if (this.openList.indexOf(this.gridsList[col][row]) < 0) {
                                this.openList.push(this.gridsList[col][row]);
                            }
                            // // 重新按照f值排序（升序排列)
                        }
                    }
                }
            }
            // 遍历完四周节点后把当前节点加入关闭列表
            this.closeList.push(curGrid);
            // 从开放列表把当前节点移除
            this.openList.splice(this.openList.indexOf(curGrid), 1);
            if (this.openList.length <= 0) {
                // Logger.log(this,"find path failed.");
                this.path = [];
                if (callback) {
                    callback(this.path)
                }
                break;
            }
            // 重新按照f值排序（升序排列)
            this.openList.sort((x, y) => {
                return x.f - y.f;
            });
        }
    }

    /**
     * 生成路径
     * @param grid 
     */
    private generatePath(grid: AstarGrid) {
        this.path.push(grid);
        while (grid.parent) {
            grid = grid.parent;
            this.path.push(grid);
        }
        return this.path;
    }

    onDestroy() {
    }
}
