import { Logger } from "../utils/Logger";
import PrefabLoader from "../utils/PrefabLoader";
import LocalStorage from "../utils/LocalStorage";
import EventManager from "../utils/EventManager";
import CommonEvent from "../config/CommonEvent";
import MusicConfig from "../config/MusicConfig";

const { ccclass, property } = cc._decorator;
/**
 * 音效
 * Ios暂时有bug，弃用
 */
@ccclass
export default class SoundPrefab extends cc.Component {

    private static prefab: cc.Prefab = null;
    private static SOUND_VOLUMN_KEY: string = "soundVolumn";

    public static soundVolumn: number = 1;

    private static Pool_Init_Num: number = 30;
    private static pool: cc.NodePool = new cc.NodePool();

    private static nowAudioNodeList: Array<cc.Node> = [];

    private audioName: string = "";
    private audioUrl: string = "";

    private static getAudioNode() {
        let node: cc.Node = null;
        // if (this.pool.size() > 0) {

        //     node = this.pool.get();
        // } else {
        node = cc.instantiate(this.prefab);
        // }
        return node;
    }

    public static play(key: string) {
        let url: string = MusicConfig.musicKey2Path.get(key);
        if (url) {
            cc.loader.loadRes(url, cc.AudioClip, (error: Error, clip: cc.AudioClip) => {
                if (error) {
                    Logger.warn(this, "load sound error===", error.message);
                } else {
                    if (clip) {
                        let audioNode: cc.Node = this.getAudioNode();
                        if (audioNode) {
                            audioNode.getComponent(cc.AudioSource).clip = clip;
                            audioNode.getComponent(cc.AudioSource).volume = SoundPrefab.soundVolumn;
                            audioNode.getComponent(cc.AudioSource).loop = false;
                            audioNode.getComponent(cc.AudioSource).rewind();
                            audioNode.getComponent(cc.AudioSource).play();
                            audioNode.getComponent(SoundPrefab).audioName = key;
                            audioNode.getComponent(SoundPrefab).audioUrl = url;
                            this.nowAudioNodeList.push(audioNode);
                        }
                    }
                }
            });
        } else {
            Logger.warn(this, "播放不存在的music=", key);
        }
    }

    public static changeVolumn(nowVolumn: number) {
        this.soundVolumn = nowVolumn;
        for (let i = 0; i < this.nowAudioNodeList.length; i++) {
            let audioNode: cc.Node = this.nowAudioNodeList[i];
            let audioSource: cc.AudioSource = audioNode.getComponent(cc.AudioSource);
            if (audioSource.isPlaying) {
                audioSource.volume = nowVolumn;
            }
        }
        LocalStorage.setItem(SoundPrefab.SOUND_VOLUMN_KEY, SoundPrefab.soundVolumn.toString());
    }

    private static preInit() {
        EventManager.instance.addListener(CommonEvent.Event_FrameUpdate, this.updateFrame, this)
        SoundPrefab.soundVolumn = parseFloat(LocalStorage.getItem(SoundPrefab.SOUND_VOLUMN_KEY));
        if (isNaN(SoundPrefab.soundVolumn)) {
            SoundPrefab.soundVolumn = 1;
        }
    }

    private static updateFrame() {
        for (let i = 0; i < this.nowAudioNodeList.length; i++) {
            let audioNode: cc.Node = this.nowAudioNodeList[i];
            let audioSource: cc.AudioSource = audioNode.getComponent(cc.AudioSource);
            if (!audioSource.isPlaying) {
                SoundPrefab.nowAudioNodeList.splice(i, 1);
            }
        }
    }

    public static preLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            PrefabLoader.loadPrefab("share/uicomponent/SoundPrefab", (loadedResource: cc.Prefab) => {
                SoundPrefab.prefab = loadedResource;
                this.preInit();
                // for (let i = 0; i < this.Pool_Init_Num; i++) {
                //     let tempNode: cc.Node = cc.instantiate(loadedResource);
                //     this.pool.put(tempNode);
                // }
                resolve();
            });
        })
    }

    public static destory() {
        EventManager.instance.removeListener(CommonEvent.Event_FrameUpdate, this.updateFrame)
        for (let i = 0; i < this.nowAudioNodeList.length; i++) {
            let audioNode: cc.Node = this.nowAudioNodeList[i];
            audioNode.getComponent(cc.AudioSource).stop();
            audioNode.getComponent(cc.AudioSource).destroy();
        }
        this.nowAudioNodeList = [];
        this.pool.clear();
    }
}
