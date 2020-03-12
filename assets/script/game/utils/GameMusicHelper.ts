import SoundPrefab from "../../engine/uicomponent/SoundPrefab";
import MusicPrefab from "../../engine/uicomponent/MusicPrefab";

export default class GameMusicHelper {

    public static playDing() {
        SoundPrefab.play("ding");
    }

    public static playFight(){
        MusicPrefab.play("fightbg")
    }

    public static playStory(){
        MusicPrefab.play("story")
    }

    public static playDead(){
        SoundPrefab.play("dead")
    }

}
