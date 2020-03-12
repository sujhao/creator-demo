
export enum TaskState{
    NoStart=0,
    Running=1,
    Finish=2
}

export default class TaskModel {

    public taskId:number = 0;
    public taskState:number = 0;


    constructor(taskId:number){
        this.taskId = taskId;
        this.taskState = TaskState.NoStart;
    }
}