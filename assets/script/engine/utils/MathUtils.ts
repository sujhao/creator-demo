
export default class MathUtils {

    /**
     * 2个点之前的直线距离
     * @param p1 
     * @param p2 
     */
    public static distance(p1:cc.Vec2, p2:cc.Vec2) {
        return Math.sqrt(Math.pow(p2.y-p1.y, 2) + Math.pow(p2.x-p1.x, 2));
    }

    /**
     * 2点间的向量
     * @param p1 
     * @param p2 
     */
    public static sub(p1: cc.Vec2, p2: cc.Vec2){
        return cc.v2(p1.x-p2.x, p1.y-p2.y);
    }

    /**
     * 弧度转角度 
     * @param radians 
     */
    public static radiansToDegrees(radians:number){
        return 180/Math.PI*radians;
    }

    /**
     * 角度转弧度 
     * @param degrees 
     */
    public static degreesToRadians(degrees:number){
        return Math.PI*degrees/180;
    }

}
