import { Logger } from "./Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabLoader {

    private static isLoading: boolean = false;

    public static loadPrefab(url: string, callback: Function) {
        if (this.isLoading) return;
        this.isLoading = true;
        cc.loader.loadRes(url, (error: Error, loadedResource) => {
            if (error) {
                Logger.warn(this, '载入Prefab失败, 原因:', url, error.message);
                return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
                Logger.warn(this, '你载入的不是Prefab, 你做了什么事?');
                return;
            }
            callback(loadedResource);
            this.isLoading = false;
        });
    }
}
