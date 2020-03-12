import {Logger} from "./Logger";

export default class LocalStorage {

    public static GamePreFlag:string = "fengshen-game-HaoLocalStorage";

    public static setItem(key:string, value:string):void{
        cc.sys.localStorage.setItem(LocalStorage.GamePreFlag + key, value);
    }

    public static getItem(key:string):string{
        return cc.sys.localStorage.getItem(LocalStorage.GamePreFlag+key);
    }

    public static removeItem(key:string):void{
        cc.sys.localStorage.removeItem(LocalStorage.GamePreFlag+key);
    }

    public static getInt(key:string):number{
        let tempValue:string = LocalStorage.getItem(key);
        let result:number = 0;
        if(tempValue){
            result = parseInt(tempValue);
        }
        return result;
    }

    public static setInt(key:string, value:number):void{
        LocalStorage.setItem(key, value.toString());
    }

    public static getFloat(key:string):number{
        let tempValue:string = LocalStorage.getItem(key);
        let result:number = 0;
        if(tempValue){
            result = parseFloat(tempValue);
        }
        return result;
    }

    public static setFloat(key:string, value:number):void{
        LocalStorage.setItem(key, value.toString());
    }

    public static getBoolean(key:string):boolean{
        let temp:number = LocalStorage.getInt(key);
        if(temp == 1){
            return true;
        }
        return false;
    }

    public static setBoolean(key:string, value:boolean){
        if(value){
            LocalStorage.setInt(key, 1);
        }else{
            LocalStorage.setInt(key, 0);
        }
    }

    public static clear(){
        cc.sys.localStorage.clear();
    }
}