
const enum LOG_LEVEL_TYPES { DEBUG, LOG, INFO, WARN, ERROR }
const Log_Level_Names: Array<string> = ["debug", "log", "info", "warn", "error"];

export class Logger {
    public static tag: string = "[HaoJslog]"; //可以设置当前游戏的前缀

    public static LEVEL: number = LOG_LEVEL_TYPES.LOG; //当前Logger等级

    public static Log_Color_Config: Array<string> = [
        "color:#890;font-size:10px;",
        "color:#000;font-size:11px;",
        "color:#09f;font-size:12px;",
        "color:#f90;font-size:13px;",
        "color:#f00;font-size:15px;",
    ];

    private static Terminal_Log: boolean = false;

    public static formatNow() {
        let date: Date = new Date(); //后端返回的时间戳是秒
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
    }

    private static getLogPreKey(nowLevel: number): string {
        let str: string = "[" + Logger.formatNow() + "] " + Logger.tag + " ["
            + Log_Level_Names[nowLevel] + "] ";
        return str;
    }

    public static debug(...params: any) {
        if (Logger.LEVEL > LOG_LEVEL_TYPES.DEBUG) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.DEBUG);
        let fileStr: string = str + params.join(" ");
        // LogErrorFileUtil.debug(fileStr);
        if (this.Terminal_Log) {
            console.log("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.DEBUG], ...params)
        } else {
            console.log(str, ...params)
        }
    }

    public static log(...params: any) {
        if (Logger.LEVEL > LOG_LEVEL_TYPES.LOG) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.LOG);
        let fileStr: string = str + params.join(" ");
        // LogErrorFileUtil.log(fileStr);
        if (this.Terminal_Log) {
            console.log("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.DEBUG], ...params)
        } else {
            console.log(str, ...params)
        }
    }

    public static info(...params: any) {
        if (Logger.LEVEL > LOG_LEVEL_TYPES.INFO) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.INFO);
        let fileStr: string = str + params.join(" ");
        if (this.Terminal_Log) {
            console.info("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.DEBUG], ...params)
        } else {
            console.info(str, ...params)
        }
    }

    public static warn(...params: any) {
        if (Logger.LEVEL > LOG_LEVEL_TYPES.WARN) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.WARN);
        let fileStr: string = str + params.join(" ");
        if (this.Terminal_Log) {
            console.warn("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.DEBUG], ...params)
        } else {
            console.warn(str, ...params)
        }
    }

    public static error(...params: any) {
        if (Logger.LEVEL > LOG_LEVEL_TYPES.ERROR) {
            return;
        }
        let str: string = this.getLogPreKey(LOG_LEVEL_TYPES.ERROR);
        let fileStr: string = str + params.join(" ");
        if (this.Terminal_Log) {
            console.error("%c" + str, this.Log_Color_Config[LOG_LEVEL_TYPES.DEBUG], ...params)
        } else {
            console.error(str, ...params)
        }
    }

}