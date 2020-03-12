import { Logger } from "./Logger";

export default class Md5Helper {

    public static getMd5Default(str: string) {
        let md5Key: string = md5(str);
        Logger.log(this, "getMd5Default=====", md5Key);
        return md5Key;
    }
}
