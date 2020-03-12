
export default class RandomUtil {

    //随机minNum到maxNum的数字 （包含maxNum）
    public static nextInt(minNum: number, maxNum: number) {
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }

    public static nextNumber(minNum: number, maxNum: number) {
        return Math.random() * (maxNum - minNum) + minNum;
    }

    public static nextSign() {
        let temp = Math.random();
        if (temp < 0.5) {
            return 1
        }
        return -1;
    }

    public static nextBoolean() {
        let temp = Math.random();
        if (temp < 0.5) {
            return true
        }
        return false;
    }

    public static randomArr(nowArr: Array<any>, needNum: number) {
        let tempArr: Array<any> = nowArr.concat();
        let resultArr: Array<any> = [];
        for (let index = 0; index < needNum; index++) {
            if (tempArr.length <= 0) {
                break;
            }
            let randomIndex: number = RandomUtil.nextInt(0, tempArr.length - 1);
            resultArr.push(tempArr.splice(randomIndex, 1)[0]);
        }
        return resultArr;
    }

    public static randomItem(nowArr: Array<any>) {
        return this.randomArr(nowArr, 1)[0];
    }

    public static randomP(left: number, right: number, up: number, down: number) {
        let randomX: number = RandomUtil.nextNumber(left, right)
        let randomY: number = RandomUtil.nextNumber(up, down)
        return cc.v2(randomX, randomY)
    }

}
