import { ConstValue } from "./ConstValue";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DataReporting{

    public static isRepeatReport: boolean = true;//数据上报是否重复上报，如果已经上报过  则不能再上报
    private static instance: DataReporting;
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DataReporting();
        }
        return this.instance;
    }
    /**
     * 向课堂端派发事件
     * @param key 事件名字
     * @param value 事件参数
     */
    public dispatchEvent(key: string, value: any = null) {
        if (ConstValue.IS_EDITIONS) {
            if (value) {
                courseware.page.sendToParent(key, value);
            } else {
                courseware.page.sendToParent(key);
            }
        }
    }

    /**
     * 监听课堂端发出的事件
     * @param key 事件名字
     * @param callBack 响应函数
     */
    public addEvent(key: string, callBack) {
        if (ConstValue.IS_EDITIONS) {
            courseware.page.on(key, callBack);
        }
    }
}
