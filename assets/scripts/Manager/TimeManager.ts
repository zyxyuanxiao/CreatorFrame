export class TimeManager {
    private static instance: TimeManager = null;
    public static getInstance(): TimeManager {
        if (this.instance == null) {
            this.instance = new TimeManager();
        }
        return this.instance;
    }

    //private timeDate = null;

    constructor() {
        //this.timeDate = new Date();
    }

    getCurrentTime(): number {
        //return this.timeDate.getTime();
        let timeDate = new Date();
        return timeDate.getTime();
    }

    //加载时间上报
    getNowFormatDate(): string {
        var date = new Date();
        var seperator1 = ":";
        var year: any = date.getFullYear();
        var month: any = date.getMonth() + 1;
        var day: any = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }

        var hours: any = date.getHours();       //获取当前小时数(0-23)
        var minutes: any = date.getMinutes();     //获取当前分钟数(0-59)
        var seconds: any = date.getSeconds();     //获取当前秒数(0-59)
        var milliSceonds: any = date.getMilliseconds();    //获取当前毫秒数(0-999)
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        if (milliSceonds >= 0 && milliSceonds <= 9) {
            milliSceonds = "00" + milliSceonds;
        }
        if (milliSceonds >= 10 && milliSceonds <= 90) {
            milliSceonds = "0" + milliSceonds;
        }

        var currentdate = year + seperator1 + month + seperator1 + day + seperator1 + hours + seperator1 + minutes + seperator1 + seconds + seperator1 + milliSceonds;
        return currentdate;
    }
}