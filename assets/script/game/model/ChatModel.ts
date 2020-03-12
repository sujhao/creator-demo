export default class ChatModel {

    public id: number = 1;

    public name: string = "";
    public content: string = "";

    constructor(id: number, name: string, content: string) {
        this.id = id;
        this.name = name;
        this.content = content;
    }


    public isMe(){
        if(this.name == "我" || this.name == "" || this.name == null){
            return true;
        }
    }
}
