import EventManager, { HaoEvent } from "../../engine/utils/EventManager";
import SceneBase from "./SceneBase";
import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartScene extends SceneBase {

    public static scriptName: string = "StartScene";


    onLoadMe() {

    }

    update() {

    }

   
    onDestroyMe() {
    }
}
