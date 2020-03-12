import ManifestConfig from "../config/ManifestConfig";
import EventManager from "./EventManager";
import HotUpdate from "./HotUpdate";


export default class VersionManager {

    public static instance: VersionManager = new VersionManager();

    public static Config_Game_Name: Array<string> = [
        "游戏大厅"
    ];

    //热更文件下载来后存放文件夹
    public static Config_Key: Array<string> = [
        "main-remote-asset",
    ];

    private static Config_ManifestName: string = "project.manifest";

    public static Config_Url_Key: Array<string> = [
        "main",
    ];

    public iosStoreUrl: string = "";
    public apkStoreUrl: string = "";

    public nowVersion: string = ManifestConfig.version; //网页显示版本号，如果是热更会替换改值
    public targetVersion:string = "1.0.0";

    public isOpenHotUpdate: boolean = true;  //是否打开热更

    private hotUpdateList: Array<HotUpdate> = [];

    private noUpdateIndex: number = -1; //

    public init() {
        this.reInitAll();
    }
    public reInitAll() {
        this.releaseAll();
        for (let i = 0; i < VersionManager.Config_Key.length; i++) {
            this.reInit(i);
        }
    }

    public releaseAll() {
        for (let i = 0; i < VersionManager.Config_Key.length; i++) {
            if (this.hotUpdateList[i]) {
                this.hotUpdateList[i].disposeUpdate();
            }
        }
    }

    public reInit(index: number) {
        if (!this.hotUpdateList[index]) {
            this.hotUpdateList[index] = new HotUpdate();
        }
        this.hotUpdateList[index].init(index, VersionManager.Config_Key[index], VersionManager.Config_ManifestName);
        if (!this.isOpenHotUpdate) {
            this.hotUpdateList[index].isCheck = true;
            this.hotUpdateList[index].isFinishUpdate = true;
        }
    }

    public checkUpdate(keyIndex: number) {
        if (keyIndex < this.hotUpdateList.length) {
            let hotUpdate: HotUpdate = this.hotUpdateList[keyIndex];
            if (cc.sys.isNative) {
                if (keyIndex == this.noUpdateIndex) {//在大厅热更，不用子游戏热更了
                    hotUpdate.isCheck = true;
                    hotUpdate.isFinishUpdate = true;
                    EventManager.instance.dispatchEvent(HotUpdate.Event_On_ALREADY_UP_TO_DATE, VersionManager.Config_Key[keyIndex]);
                } else {
                    hotUpdate.checkUpdate();
                }
            } else {
                hotUpdate.isCheck = true;
                hotUpdate.isFinishUpdate = true;
                EventManager.instance.dispatchEvent(HotUpdate.Event_On_ALREADY_UP_TO_DATE, VersionManager.Config_Key[keyIndex]);
            }
        } else {
            EventManager.instance.dispatchEvent(HotUpdate.Event_On_ALREADY_UP_TO_DATE, VersionManager.Config_Key[keyIndex]);
        }
    }

    public startUpdate(keyIndex: number) {
        let hotUpdate: HotUpdate = this.hotUpdateList[keyIndex];
        hotUpdate.startUpdate();
    }

    public isCheck(keyIndex: number) {
        if (keyIndex < this.hotUpdateList.length) {
            let hotUpdate: HotUpdate = this.hotUpdateList[keyIndex];
            if (keyIndex == this.noUpdateIndex) {
                return true;
            }
            return hotUpdate.isCheck;
        }
        return true;
    }

    public needUpdate(keyIndex: number) {
        if (keyIndex < this.hotUpdateList.length) {
            let hotUpdate: HotUpdate = this.hotUpdateList[keyIndex];
            if (keyIndex == this.noUpdateIndex) {
                return false;
            }
            return hotUpdate.needUpdate;
        }
        return false;
    }

    public isUpdating(keyIndex: number) {
        if (keyIndex < this.hotUpdateList.length) {
            let hotUpdate: HotUpdate = this.hotUpdateList[keyIndex];
            return hotUpdate.isUpdating;
        }
        return false;
    }

    public isFinishUpdate(keyIndex: number) {
        if (keyIndex < this.hotUpdateList.length) {
            let hotUpdate: HotUpdate = this.hotUpdateList[keyIndex];
            if (keyIndex == this.noUpdateIndex) {
                return true;
            }
            return hotUpdate.isFinishUpdate;
        }
        return true;
    }
}