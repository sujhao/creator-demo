import { Logger } from "../../engine/utils/Logger";
import LoadingScenePrefab from "../../engine/uicomponent/LoadingScenePrefab";
import CommonTips from "../../engine/uicomponent/CommonTips";
import EventManager from "../../engine/utils/EventManager";
import CommonEvent from "../../engine/config/CommonEvent";

export default class SceneManager {

    public static instance: SceneManager = new SceneManager();

    private loadingSceneName: string;

    public currentSceneName: string;

    public initFullScreenPrefab(isShow: boolean = false) {
        if (cc.sys.isBrowser && !cc.sys.isMobile) {
            if (isShow) {
                // FullscreenPrefab.show();
            } else {
                // FullscreenPrefab.close();
            }
        }
    }

    public sceneSwitch(name: string, showProgress: boolean = false) {
        if (this.loadingSceneName == name) return;
        Logger.log(this, "sceneSwitch==", name);
        if (cc.sys.isBrowser) {
            // showProgress = true;
        }
        this.initFullScreenPrefab(false);
        this.loadingSceneName = name;
        if (showProgress) {
            LoadingScenePrefab.show();
            cc.director.preloadScene(name,
                (completedCount: number, totalCount: number, item: any) => {
                    LoadingScenePrefab.updateLoading(completedCount, totalCount);
                },
                (error: Error, asset: cc.SceneAsset) => {
                    if (error) {
                        Logger.warn(this,"preloadScene=error", error.message);
                        CommonTips.showMsg("加载场景失败");
                    } else {
                        cc.director.getScene().cleanup();
                        cc.director.loadScene(name, this.loadSceneOK.bind(this));
                    }
                });
        } else {
            cc.director.getScene().cleanup();
            cc.director.loadScene(name, this.loadSceneOK.bind(this));
        }
    }

    private loadSceneOK() {
        LoadingScenePrefab.close();
        this.initFullScreenPrefab(true);
        this.currentSceneName = this.loadingSceneName;
        this.loadingSceneName = "";
        Logger.log(this, "scene load ok=", this.currentSceneName);
        EventManager.instance.dispatchEvent(CommonEvent.Event_Scene_Switch);
    }

    public preloadScene(sceneName: string, onProgressCallback: any = null, onLoadedCallback: any = null) {
        cc.director.preloadScene(sceneName, onProgressCallback, onLoadedCallback);
    }

}
