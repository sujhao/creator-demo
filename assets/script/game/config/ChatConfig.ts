import ChatModel from "../model/ChatModel";
import ChatStory from "../model/ChatStory";

export default class ChatConfig {

    public static config:Array<ChatStory> = [
        new ChatStory(1, [
            new ChatModel(0, "我", "嗯！我怎么在这里，我不是在家睡觉的么？\n发生了什么？谁能告诉我，\n这里是哪里，我在做梦？"),
            new ChatModel(1, "系统", "宿主，你好，现在你所在的世界是封神世界"),
            new ChatModel(2, "我", "什么封神?姜子牙那个封神榜世界?"),
            new ChatModel(3, "系统", "对的。叮，主线任务开启。\n宿主成为封神世界第一强者，\n即可返回主世界"),
            new ChatModel(4, "我", "啊，还有任务的啊，那我怎么变强啊？\n打怪升级吗？"),
            new ChatModel(5, "系统", "对的，宿主只要打怪就能升级变强，\n加油吧，骚年!"),
        ]),
        new ChatStory(2, [
            new ChatModel(0, "小兵", "喂，那个小鬼，你在那边鬼鬼祟祟干嘛呢?"),
            new ChatModel(1, "我", "我吗？"),
            new ChatModel(2, "小兵", "不是来抢我们粮食的吧，\n兄弟们，有人来抢粮食了。"),
            new ChatModel(3, "我", "我。。系统，系统在吗，\n现在咋办，我不会武功啊!"),
            new ChatModel(4, "系统", "别紧张，现在送宿主新手礼包,\n快速掌握基础剑法以及新手剑一把！"),
            new ChatModel(5, "我", "哥来了，敢瞧不起我!"),
        ]),
    ]

    public static getChatStory(id:number){
        for(let i=0; i<this.config.length; i++){
            let chatStory:ChatStory = this.config[i]
            if(chatStory.id == id){
                return chatStory;
            }
        }
    }
}