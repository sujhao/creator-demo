import { Logger } from "./Logger";
import EventManager from "./EventManager";
import VersionManager from "./VersionManager";
import ManifestConfig from "../config/ManifestConfig";
import ResourcePreload from "../../game/utils/ResourcePreload";
import CommonTips from "../uicomponent/CommonTips";

export default class HotUpdate {

    public static Event_CheckUpdate: string = "Event_CheckUpdate";

    public static Event_On_Progress: string = "HotUpdate_Event_On_Progress";
    public static Event_On_NeedUpdate: string = "HotUpdate_Event_On_NeedUpdate";
    public static Event_Finish_Update: string = "HotUpdate_Event_Finish";
    public static Event_On_ALREADY_UP_TO_DATE: string = "HotUpdate_Event_On_ALREADY_UP_TO_DATE";
    public static Event_On_Fail_Update: string = "HotUpdate_Event_On_Fail_Update";

    private _am: any;
    private _checkListener;
    private storagePath: string;
    private manifestUrl: string;
    private localBigVersion: number;
    private remoteBigVersion: number;

    public needUpdate: boolean = false;
    public isUpdating: boolean;
    public isFinishUpdate: boolean;
    public isCheck: boolean;
    private key: string;
    private hotupdateIndex: number;

    constructor() {
    }

    public init(index: number, key: string = "Code-remote-asset", manifestUrl: string) {
        if (cc.sys.isNative) {
            this.hotupdateIndex = index;
            this.key = key;
            this.storagePath = jsb.fileUtils.getWritablePath() + key;
            this.manifestUrl = manifestUrl;
            if (!jsb.fileUtils.isDirectoryExist(this.storagePath)) {
                jsb.fileUtils.createDirectory(this.storagePath)
            }
            Logger.log(this, "init removeDirectory=", this.storagePath + "_temp");
        }
        this.needUpdate = false;
        this.isUpdating = false;
        this.isFinishUpdate = false;
        this.isCheck = false;
    }

    private jumpToPack() {
        let url: string;
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                url = VersionManager.instance.apkStoreUrl;
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                url = VersionManager.instance.iosStoreUrl;
            }
        }
        Logger.info(this, "jumpToPack==androidurl===", VersionManager.instance.apkStoreUrl);
        Logger.info(this, "jumpToPack==iosStoreUrl===", VersionManager.instance.iosStoreUrl);
        Logger.info(this, "jumpToPack=====", url);
        cc.sys.openURL(url);
        // cc.game.end();
    }

    //显示强制更新，即更细包面板
    private showPackUpdateDialog() {
        CommonTips.showMsg("有新的版本需要更新，下载后请先卸载，以前的版本，再安装！")
        this.jumpToPack();
        this.showPackUpdateDialog();
    }

    private checkCb(event) {
        Logger.log(this, 'checkCb Code: =================' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                Logger.info(this, "No local manifest file found, hot update skipped.");
                this.failUpdate();
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                Logger.info(this, "Fail to download manifest file, hot update skipped.");
                this.failUpdate();
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                Logger.info(this, "Already up to date with the latest remote version.");
                this.alreadyUpToDate();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                Logger.info(this, "new version found, please try to update.", this.localBigVersion, this.remoteBigVersion);
                if (this.key == VersionManager.Config_Key[0] && this.localBigVersion < this.remoteBigVersion) { //更新大版本
                    Logger.info(this, "new version found, please try to update======packupdate=", this.localBigVersion, this.remoteBigVersion);
                    this.showPackUpdateDialog();
                }
                else {
                    Logger.info(this, "new version found, please try to update======hotupdate=", this.localBigVersion, this.remoteBigVersion);
                    // this._am.update();
                    this.needUpdate = true;
                    EventManager.instance.dispatchEvent(HotUpdate.Event_On_NeedUpdate, this.key);
                }
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // var currentPercent = event.getPercent();
                // var totalPercent = event.getPercentByFile();
                // var fileprocess = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // var byteprocess = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                Logger.info(this, "UPDATE_PROGRESSION2222==========", this.key, event.getDownloadedBytes(), event.getTotalBytes());
                if (event.getTotalBytes() > 0) {
                    EventManager.instance.dispatchEvent(HotUpdate.Event_On_Progress, event.getDownloadedBytes(), event.getTotalBytes(), this.key)
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                Logger.info(this, "UPDATE_FINISHED==============");
                this.finishUpdate(true);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                Logger.warn(this, "Update failed==========", event.getMessage());
                this.failUpdate();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                let fullFilePath: string = this.storagePath + "/" + event.getAssetId();
                let tempFilePath: string = this.storagePath + "_temp/" + event.getAssetId();
                Logger.warn(this, "fullFilePath====", fullFilePath);
                Logger.warn(this, "tempFilePath====", tempFilePath);
                // jsb.fileUtils.removeFile(tempFilePath);
                Logger.warn(this, "ERROR_UPDATING=============", event.getAssetId(), event.getMessage());
                this.failUpdate();
                break;
            default:
                // this.failUpdate();
                return;
        }
    }

    public checkUpdate() {
        if (this.isUpdating || this.isCheck) {
            Logger.log(this, "Checking or updating ...");
            return;
        }
        let hotupdateUrlKey: string = VersionManager.Config_Url_Key[this.hotupdateIndex];
        Logger.log(this, "checkoutUpdate=====", this.manifestUrl, hotupdateUrlKey);
        if (!this._am) {
            this._am = new jsb.AssetsManager('', this.storagePath, this.versionCompareHandle.bind(this));
        }
        // this._am.setMaxConcurrentTask(1);
        let manifestStr: string = ManifestConfig.getManifestStr(hotupdateUrlKey);
        Logger.log(this, "checkUpdate=======manifestStr=======", manifestStr);
        let manifest = new jsb.Manifest(manifestStr, this.storagePath);
        this._am.setVerifyCallback(function (filePath, asset) {
            return true;
            // var md5 = calculateMD5(filePath);
            // if (md5 === asset.md5)
            //     return true;
            // else
            //     return false;
        });
        this._am.setEventCallback(this.checkCb.bind(this));
        // 设置事件回调
        this.isCheck = true;
        this._am.loadLocalManifest(manifest, this.storagePath);
        this._am.checkUpdate();
    }

    /**
     * @param versionA 本地版本 1.0.0
     * @param versionB 服务器版本 1.0.1
     * @param return -1需要更新 不用更新
     */
    private versionCompareHandle(versionA, versionB) {
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        Logger.log(this, "versionCompareHandle======", this.key, VersionManager.Config_Key[0]);
        if (this.key == VersionManager.Config_Key[0]) {
            Logger.log(this, "versionCompareHandle22===", versionA, versionB);
            VersionManager.instance.nowVersion = versionA;
            VersionManager.instance.targetVersion = versionB;
        }
        this.localBigVersion = parseInt(vA[0]);
        this.remoteBigVersion = parseInt(vB[0]);
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }

    public startUpdate() {
        if (this.isUpdating) return;
        let localManifest = this._am.getLocalManifest();
        let remoteManifest = this._am.getRemoteManifest();
        Logger.log(this, "startUpdate111===", localManifest.getVersionFileUrl());
        Logger.log(this, "startUpdate2222===", localManifest.getManifestFileUrl());
        Logger.log(this, "startUpdate3333===", remoteManifest.getVersionFileUrl());
        Logger.log(this, "startUpdate4444===", remoteManifest.getManifestFileUrl());
        this.isUpdating = true;
        EventManager.instance.dispatchEvent(HotUpdate.Event_On_Progress, 0, 100, this.key)
        this._am.update();
    }

    public disposeUpdate() {
        if (this._am) {
            this._am.setVerifyCallback(null);
            this._am.setEventCallback(null);
        }
        this._am = null;
        this._checkListener = null;
        this.isUpdating = false;
        this.needUpdate = false;
    }

    private failUpdate() {
        this.disposeUpdate();
        this.isCheck = false;
        EventManager.instance.dispatchEvent(HotUpdate.Event_On_Fail_Update, this.key);
    }

    private alreadyUpToDate() {
        this.disposeUpdate();
        this.isFinishUpdate = true;
        EventManager.instance.dispatchEvent(HotUpdate.Event_On_ALREADY_UP_TO_DATE, this.key);
    }

    private finishUpdate(needRestart: boolean) {
        Logger.info(this, "更新完成=====", needRestart);
        this.disposeUpdate();
        this.isFinishUpdate = true;
        EventManager.instance.dispatchEvent(HotUpdate.Event_Finish_Update, this.key, needRestart);
        if (needRestart) {
            var searchPaths = jsb.fileUtils.getSearchPaths();
            Logger.info(this, "更新完成====searchPaths======", searchPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            if (this.key == VersionManager.Config_Key[0]) {
                ResourcePreload.instance.restartGame();
            }
        }
    }

}