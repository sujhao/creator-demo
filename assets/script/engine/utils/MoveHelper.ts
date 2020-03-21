import { Logger } from "./Logger";
import MathUtils from "./MathUtils";

export class MoveHelper {

    public static moveNode(moveNode: cc.Node, speed: number, tx: number, ty: number, minSpeed: number = 0.01) {
        let isMoving: boolean = false;
        let times: number = 0;
        let rad: number = MathUtils.p2pRad(moveNode.getPosition(), cc.v2(tx, ty))
        let speedX: number = speed * Math.cos(rad)
        let speedY: number = speed * Math.sin(rad)
        if (Math.abs(moveNode.x - tx) > minSpeed) {
            times = Math.floor(Math.abs(speedX / minSpeed));
            for (let i = 0; i < times; i++) {
                if (moveNode.x > tx) {
                    moveNode.x -= minSpeed;
                } else {
                    moveNode.x += minSpeed;
                }
                if (Math.abs(moveNode.x - tx) <= minSpeed * 2) {
                    moveNode.x = tx;
                }
            }
            isMoving = true;
        }
        if (Math.abs(moveNode.y - ty) > minSpeed) {
            times = Math.floor(Math.abs(speedY / minSpeed));
            for (let j = 0; j < times; j++) {
                if (moveNode.y > ty) {
                    moveNode.y -= minSpeed;
                } else {
                    moveNode.y += minSpeed;
                }
                if (Math.abs(moveNode.x - ty) <= minSpeed * 2) {
                    moveNode.y = ty;
                }
            }
            isMoving = true;
        }
        return isMoving;
    }
}