const {ccclass, property} = cc._decorator;

@ccclass
export default class CommonEvent{

    public static Event_FrameUpdate: string = "Event_FrameUpdate";
    public static Event_ConnectTimeOut: string = "Event_ConnectTimeOut";
    public static Event_ResourceLoader: string = "Event_ResourceLoader";
    public static Event_CheckUpdate: string = "Event_CheckUpdate";
    public static Event_Scene_Switch: string = "Event_Scene_Switch";
}
