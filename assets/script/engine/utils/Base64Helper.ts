import { Logger } from "./Logger";
import { Base64 } from "./base64";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Base64Helper {

    public static encode(str: string): string {
        let result: string = Base64.encode(str);
        Logger.log(this, "Base64Helper.encode=", result);
        return result
    }

    public static decode(str: string): string {
        let result = Base64.decode(str);
        Logger.log(this, "Base64Helper.decode=", result);
        return result;
    }

}
