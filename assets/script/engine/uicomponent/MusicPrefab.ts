import { Logger } from "../utils/Logger";
import PrefabLoader from "../utils/PrefabLoader";
import LocalStorage from "../utils/LocalStorage";
import MusicConfig from "../config/MusicConfig";

const { ccclass, property } = cc._decorator;
/**
 * 背景音乐
 */
@ccclass
export default class MusicPrefab extends cc.Component {

    private static instance: MusicPrefab;
    private static MUSIC_VOLUMN_KEY: string = "musicVolumn";

    public static musicVolumn: number = 1;

    public static play(key: string) {
        let url: string = MusicConfig.musicKey2Path.get(key);
        if (url) {
            cc.loader.loadRes(url, cc.AudioClip, (error: Error, clip: cc.AudioClip) => {
                if (error) {
                    Logger.warn(this, "load music error===", error.message);
                } else {
                    if (clip) {
                        this.instance.node.getComponent(cc.AudioSource).clip = clip;
                        this.instance.node.getComponent(cc.AudioSource).volume = this.musicVolumn;
                        this.instance.node.getComponent(cc.AudioSource).play();
                        this.instance.node.getComponent(cc.AudioSource).loop = true;
                    }
                }
            });
        } else {
            Logger.warn(this,"播放不存在的music=", key);
        }
    }

    public static changeVolumn(nowVolumn: number) {
        this.musicVolumn = nowVolumn;
        this.instance.node.getComponent(cc.AudioSource).volume = nowVolumn;
        LocalStorage.setItem(MusicPrefab.MUSIC_VOLUMN_KEY, this.musicVolumn.toString());
    }

    private static preInit() {
        this.musicVolumn = parseFloat(LocalStorage.getItem(MusicPrefab.MUSIC_VOLUMN_KEY));
        if (isNaN(this.musicVolumn)) {
            this.musicVolumn = 1;
        }
    }

    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("share/uicomponent/MusicPrefab", (loadedResource: cc.Prefab) => {
                MusicPrefab.instance = cc.instantiate(loadedResource).getComponent(MusicPrefab);
                this.preInit();
                resolve();
            });
        })
    }

    public static destory() {
        if (MusicPrefab.instance) {
            MusicPrefab.instance.getComponent(cc.AudioSource).stop();
            MusicPrefab.instance.destroy();
        }
        MusicPrefab.instance = null;
    }
}
