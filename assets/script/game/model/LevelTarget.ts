export default class LevelTarget {

    public level: number;
    public name: string;
    public win: string;
    public lose: string;

    public static config: Array<LevelTarget> = [
        LevelTarget.create(1, "傅山山谷一", "所有敌人都死光", "所有玩家死光"),
    ];

    public static create(level: number, name: string, win: string, lose: string) {
        let target: LevelTarget = new LevelTarget();
        target.level = level;
        target.name = name;
        target.win = win;
        target.lose = lose;
        return target;
    }

    public static getLevelTarget(nowLevel: number) {
        for (let i = 0; i < this.config.length; i++) {
            let levelTarget: LevelTarget = this.config[i];
            if (levelTarget.level == nowLevel) {
                return levelTarget;
            }
        }
    }
}
