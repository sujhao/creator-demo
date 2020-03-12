import { Logger } from "./Logger";


export default class DateUtil {

    public static formatNumStr(num: number) {
        let str = "" + num;
        if (num < 10) {
            str = "0" + num;
        }
        return str;
    }

    public static formateYearMonthDayStr(timestamp: number) {
        let date: Date = new Date(timestamp);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    public static formateMonthDayStr(timestamp: number) {
        let date: Date = new Date(timestamp);
        return (date.getMonth() + 1) + "月" + date.getDate() + "日";
    }

    //  timestamp:1453094034000  2018-1-31 19:53:44
    //根据时间戳返回 2018-1-31 19:53:44 
    public static formatDateStr(timestamp: number) {
        let date: Date = new Date(timestamp);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + this.formatNumStr(date.getHours()) + ":" + this.formatNumStr(date.getMinutes()) + ":" + this.formatNumStr(date.getSeconds());
    }

    //  timestamp:1453094034000  2018-1-31-19-53-44 
    //根据时间戳返回 2018-1-31-19-53-44 
    public static formatDateStr2(timestamp: number) {
        let date: Date = new Date(timestamp);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + this.formatNumStr(date.getHours()) + "-" + this.formatNumStr(date.getMinutes()) + "-" + this.formatNumStr(date.getSeconds());
    }

    //  timestamp:1453094034000  2018-1-31
    //根据时间戳返回 2018-1-31
    public static formatDateStr3(timestamp: number) {
        let date: Date = new Date(timestamp);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    //  timestamp:1453094034000  
    //根据时间戳返回 19:53
    public static formatHourMinStr(timestamp: number) {
        let date: Date = new Date(timestamp);
        return this.formatNumStr(date.getHours()) + ":" + this.formatNumStr(date.getMinutes());
    }

    //  timestamp:1453094034000  
    //根据时间戳返回 19:53:11
    public static formatHourMinSecondStr(timestamp: number) {
        let date: Date = new Date(timestamp);
        return this.formatNumStr(date.getHours()) + ":" + this.formatNumStr(date.getMinutes()) + ":" + this.formatNumStr(date.getSeconds());
    }

    public static now(): number {
        let date: Date = new Date();
        return date.getTime();
    }

    public static betweenTime(startTime: number, endTime: number) {
        let date: Date = new Date();
        if (date.getTime() >= startTime && date.getTime() <= endTime) {
            return true;
        }
        return false;
    }

    //根据时间戳返回 1天19:53:11
    public static formatLeftTime(timestamp: number){
        let result:string = "";
        let day:number = Math.floor(timestamp/(1000*60*60*24))
        let hour:number = Math.floor(timestamp/(1000*60*60)) % 24
        let min:number =  Math.floor(timestamp/(1000*60)) % 60
        let second:number = Math.floor(timestamp/1000) % 60
        result = day+"天"+this.formatNumStr(hour)+":"+this.formatNumStr(min)+":"+this.formatNumStr(second)
        return result
    }

    public static isToday(dateTime: number): boolean {
        let nowDate: Date = new Date();
        let checkDate: Date = new Date(dateTime);
        if (checkDate.getFullYear() == nowDate.getFullYear() && checkDate.getMonth() == nowDate.getMonth() && checkDate.getDate() == nowDate.getDate()) {
            return true;
        }
        return false;
    }

}
