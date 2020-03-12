
export default class LevelInfo {

    public static nowLevel:number = 1; //当前关卡

    public static levelStep:number = 1; //当前关卡步骤
    
    public static gameState:number = 0; //游戏状态 
    public static nowActionPlayerId:number = 1;   //当前操作的玩家Id
    public static showActionPlayerId:number = 1; //当前展示玩家id
    public static isEnemyAction:boolean = false; //当前是玩家还是敌人在操作

}