import AdapterHelper from "../../engine/utils/AdapterHelper";
import PrefabLoader from "../../engine/utils/PrefabLoader";
import ControlUI from "../prefab/ControlUI";
import { Logger } from "../../engine/utils/Logger";
import ResourcePrefab from "../prefab/ResourcePrefab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneBase extends cc.Component {

    public static scriptName: string = "SceneBase";

    onLoad(initControlUI: boolean = true) {
        AdapterHelper.fixApdater();
        if (initControlUI) {
            this.node.addChild(cc.instantiate(ResourcePrefab.getControlUIPrefab()), 999)
        }
        this.onLoadMe();
    }


    onLoadMe() {

    }

    start() {
        this.onStartMe();
    }

    onStartMe() {

    }

    onDestroy() {
        this.onDestroyMe();
    }

    onDestroyMe() {

    }



}
