import ChatModel from "./ChatModel";

export default class ChatStory {

    public id:number = 1;
    public chatList:Array<ChatModel> = [];

    constructor(id:number, chatList:Array<ChatModel>){
        this.id = id;
        this.chatList = chatList;
    }

}
