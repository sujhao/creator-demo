

export default class MusicConfig {
    public static musicKey2Path: Map<string, string> = new Map<string, string>();//资源预加载路径
    
    public static musicKey2Cache:Map<string, cc.AudioClip> = new Map<string, cc.AudioClip>();//资源加载后cache路径
    
    public static init(){
        // //音乐要预加载的配置
        MusicConfig.musicKey2Path.set("fightbg", "music/fightbg");
        MusicConfig.musicKey2Path.set("story", "music/story");
        MusicConfig.musicKey2Path.set("ding", "music/ding");
        MusicConfig.musicKey2Path.set("dead", "music/dead");
    }
}
