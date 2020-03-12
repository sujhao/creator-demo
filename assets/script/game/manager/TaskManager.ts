import TaskModel, { TaskState } from "../model/TaskModel";
import TaskConfig from "../config/TaskConfig";

export default class TaskManager {

    public static finishStep(taskId:number, step:number){
        let taskList:Array<TaskModel> = TaskConfig.config.get(taskId);
        for(let i=0; i<taskList.length; i++){
            let task:TaskModel = taskList[i];
            if(task.taskId == step){
                task.taskState = TaskState.Finish;
            }
        }
    }

    public static checkFinishTask(taskId:number){
        let taskList:Array<TaskModel> = TaskConfig.config.get(taskId);
        for(let i=0; i<taskList.length; i++){
            let task:TaskModel = taskList[i];
            if(task.taskState != TaskState.Finish){
                return false;
            }
        }
        return true;
    }
}
