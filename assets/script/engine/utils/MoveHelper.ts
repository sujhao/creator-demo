import { Logger } from "./Logger";

export class MoveHelper {

    public static moveNode(moveNode: cc.Node, speed:number, tx:number, ty:number, minSpeed: number = 0.01){
        let isMoving:boolean = false;
        let times:number = 0;
        if (Math.abs(moveNode.x - tx) > minSpeed) {
            times = Math.floor(speed/minSpeed);
            for (let i = 0; i < times; i++) {
                if (moveNode.x > tx) {
                    moveNode.x -= minSpeed;
                } else {
                    moveNode.x += minSpeed;
                }
                if (Math.abs(moveNode.x - tx) <= minSpeed*2) {
                    moveNode.x = tx;
                }
            }
            isMoving = true;
        }
        if (Math.abs(moveNode.y - ty) > minSpeed) {
            times = Math.floor(speed/minSpeed);
            for (let j = 0; j < times; j++) {
                if (moveNode.y > ty) {
                    moveNode.y -= minSpeed;
                } else {
                    moveNode.y += minSpeed;
                }
                if (Math.abs(moveNode.x - ty) <= minSpeed*2) {
                    moveNode.y = ty;
                }
            }
            isMoving = true;
        }
        return isMoving;
    }
}