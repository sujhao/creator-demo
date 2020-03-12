import PlayerType from "./PlayerType";
import PlayerConfig from "../config/PlayerConfig";
import { Logger } from "../../engine/utils/Logger";

export default class PlayerInfo {

    public static modelList: Array<PlayerInfo> = [];

    public level: number = 1; //玩家等级
    public playerType: number = PlayerType.jhao; //角色
    public name: string = "testplayer";
    public speed: number = 5;//速度
    public attackRange: number = 1;//攻击范围
    public life: number = 10; //生命
    public power: number = 5; //法力
    public bodyMaterial: Array<number> = []; //身上的物品
    public magic: Array<number> = []; //法术
    public attack: number = 0; //攻击
    public defend: number = 0; //防御
    public exp: number = 0; //经验


    constructor(playerType: number, name: string, level: number, speed: number, attackRange: number, life: number, power: number, bodyMaterial: Array<number>, magic: Array<number>, attack: number, defend: number, exp: number) {
        this.playerType = playerType;
        this.name = name;
        this.level = level;
        this.speed = speed;
        this.attackRange = attackRange;
        this.life = life;
        this.power = power;
        this.bodyMaterial = bodyMaterial;
        this.magic = magic;
        this.attack = attack;
        this.defend = defend;
        this.exp = exp;
    }

    /**
     * @param playerType   角色
     * @param name  名字
     * @param level 玩家等级
     * @param speed  速度
     * @param attackRange 攻击范围
     * @param life 生命
     * @param power 法力
     * @param bodyMaterial 身上的物品
     * @param magic 法术
     * @param attack 攻击
     * @param defend 防御
     * @param exp 经验
     */
    public static createPlayer(playerType: number, name: string, level: number = 1, speed: number = 1, attackRange: number = 1, life: number = 1, power: number = 1, bodyMaterial: Array<number> = [], magic: Array<number> = [], attack: number = 0, defend: number = 0, exp: number = 0) {
        return new PlayerInfo(playerType, name, level, speed, attackRange, life, power, bodyMaterial, magic, attack, defend, exp);
    }

    public static reInitNew(newPlayerName: string) {
        this.modelList = [];
        PlayerConfig.reInitNew(newPlayerName);
        let mePlayer: PlayerInfo = PlayerConfig.playerType2Info.get(PlayerType.jhao)
        this.modelList.push(mePlayer)
    }

    public static initByRecord(playerList) {
        let modelList: Array<PlayerInfo> = [];
        for (let i = 0; i < playerList.length; i++) {
            let item: object = playerList[i]
            let model: PlayerInfo = new PlayerInfo(item["level"], item["playerType"], item["name"], item["speed"], item["attackRange"], item["life"], item["power"], item["bodyMaterial"], item["magic"], item["attack"], item["defend"], item["exp"]);
            modelList[i] = model;
        }
        return modelList;
    }

    public static getPlayerInfoByPlayerType(playerType: number): PlayerInfo {
        for (let i = 0; i < this.modelList.length; i++) {
            let info: PlayerInfo = this.modelList[i];
            if (info.playerType == playerType) {
                return info;
            }
        }
    }
  
    public static getPlayerInfoByIndex(index:number){
        return this.modelList[index];
    }

    public static toString() {
        return JSON.stringify(this.modelList)
    }

}