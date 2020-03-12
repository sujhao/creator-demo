import {Logger} from "./Logger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BitUtil{

    //index是二进制从右到左
    public static isBitSet(value:number, index:number):boolean{
        let str:string = value.toString(2);
        if (parseInt(str[str.length - 1 - index]) == 1){
            return true
        }
        return false
    }

    //从右到左计算
    public static setBitValue(value: number, index: number):number{
        let newValue:number = value;
        let str:string = value.toString(2);
        let newStr:string = "";
        let maxIndex = Math.max(str.length - 1, index);
        for (let i = 0; i <= maxIndex; i++) {
            if (index == i){
                newStr = "1"+newStr;
            }else{
                if(str[i] == undefined){
                    newStr = "0"+ newStr;
                }else{
                    newStr = str[i] + newStr;
                }
            }
        }
        newValue = parseInt(newStr, 2);
        return newValue;
    }

    public static clearBitValue(value:number, index:number){
        let newValue: number = value;
        let str: string = value.toString(2);
        let newStr: string = "";
        for (let i = str.length-1; i>=0; i--) {
            if (index == (str.length - 1 - i)) {
                newStr = "0" + newStr;
            } else {
                newStr = str[i] + newStr;
            }
        }
        newValue = parseInt(newStr, 2);
        return newValue;
    }
}
