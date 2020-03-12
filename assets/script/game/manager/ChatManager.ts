import ChatConfig from "../config/ChatConfig";
import ChatModel from "../model/ChatModel";
import ChatStory from "../model/ChatStory";
import DialogChat from "../dialog/DialogChat";
import { Logger } from "../../engine/utils/Logger";

export default class ChatManager {

    public static instance: ChatManager = new ChatManager();

    private chatId: number = 0;
    private chatIndex: number = 0;

    /**
     * 开始聊天
     * @param chatId 聊天配置id
     * @param callback 
     */
    public startChat(chatId: number, callback: Function = null) {
        this.chatId = chatId;
        this.chatIndex = 0;
        this.showChat(callback);
    }

    /**
     * 
     * @param callback 
     */
    private showChat(callback: Function) {
        let chatStory: ChatStory = ChatConfig.getChatStory(this.chatId);
        if (this.chatIndex >= chatStory.chatList.length) {
            if (callback) {
                callback();
            }
        } else {
            let chatModel: ChatModel = chatStory.chatList[this.chatIndex];
            DialogChat.show(chatModel, () => {
                this.chatIndex++;
                this.showChat(callback)
            })

        }
    }


}