import { Logger } from "./Logger";

export default class HaoEncrypt {

    public static encode(str:string){
        let result:string = "";
        for (let i = 0; i <str.length; i ++) {  //遍历字符串
            let code:number = str.charCodeAt(i); // //逐个提取每个字符，并获取Unicode编码值
            if(i % 2 == 0){
                code += 2;
            }else{
                code += 1;
            }
            result += String.fromCharCode(code);
        }
        return result;
    }


    public static decode(str:string){
        let result:string = "";
        for (let i = 0; i <str.length; i ++) {  //遍历字符串
            let code:number = str.charCodeAt(i); // //逐个提取每个字符，并获取Unicode编码值
            if(i % 2 == 0){
                code -= 2;
            }else{
                code -= 1;
            }
            result += String.fromCharCode(code);
        }
        return result;
    }

}