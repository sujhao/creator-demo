import DateUtil from "../utils/DateUtil";
import NetConfig from "./NetConfig";


export default class ManifestConfig {

    public static packageUrl: string = "";
    public static remoteManifestUrl: string = "";
    public static remoteVersionUrl: string = "";
    public static version: string = "1.0.0"; //更新包要更新这里
    public static assets: object = {};
    public static searchPaths: Array<any> = [];

    public static getManifestStr(key: string) {
        let obj: Object = {};
        obj["packageUrl"] = NetConfig.hotupdateUrl + "/hotupdate/" + key + "/";
        obj["remoteManifestUrl"] = NetConfig.hotupdateUrl + "/hotupdate/" + key + "/project.manifest?t=" + DateUtil.now();
        obj["remoteVersionUrl"] = NetConfig.hotupdateUrl + "/hotupdate/" + key + "/version.manifest?t=" + DateUtil.now();
        obj["version"] = ManifestConfig.version;
        obj["assets"] = {};
        obj["searchPaths"] = [];
        return JSON.stringify(obj);
    }

}
