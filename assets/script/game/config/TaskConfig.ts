import TaskModel from "../model/TaskModel";

export default class TaskConfig {

    public static config: Map<number, Array<TaskModel>> = new Map<number, Array<TaskModel>>()
        .set(1, [
            new TaskModel(1),
            new TaskModel(2),
        ])

}