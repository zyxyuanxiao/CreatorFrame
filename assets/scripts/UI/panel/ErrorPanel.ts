import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import { AudioManager } from "../../Manager/AudioManager";
import { NetWork } from "../../Http/NetWork";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ErrorPanel extends BaseUI {

    protected static className = "ErrorPanel";
    @property(cc.Label)
    biaoTi: cc.Label = null;
    @property(cc.Label)
    shuoMing: cc.Label = null;
    @property(cc.Label)
    tiShi: cc.Label = null;
    @property(cc.Label)
    btnLab: cc.Label = null;
    @property(cc.Button)
    btn: cc.Button = null;

    isClose: boolean = false;
    callback: Function;
    start() {
        // cc.director.pause();
    }

    onLoad() {
    }
    /**
     * 设置错误弹窗数据
     * @param shuoMing 错误说明
     * @param biaoTi 标题文字
     * @param tiShi 提示文字
     * @param btnLab 按钮文字
     * @param callBack 回调函数
     * @param isClose 是否可关闭
     */
    setPanel(shuoMing: string, biaoTi?: string, tiShi?: string, btnLab?: string, callBack?: Function, isClose: boolean = false) {
        let data = {
            shuoMing: shuoMing,
            biaoTi: biaoTi,
            tiShi: tiShi
        }

        NetWork.getInstance().LogJournalReport('ErrorPanelLog', data);
        AudioManager.getInstance().playSound("sfx_erro", false, 1);
        this.shuoMing.string = shuoMing;
        this.isClose = isClose;
        this.callback = callBack;
        this.biaoTi.string = biaoTi ? biaoTi : this.biaoTi.string;
        this.tiShi.string = tiShi ? tiShi : this.tiShi.string;
        this.btnLab.string = btnLab ? btnLab : this.btnLab.string;
        this.btn.interactable = this.isClose;
    }

    onBtnClick() {
        AudioManager.getInstance().playSound("sfx_buttn", false, 1);
        if (this.callback) {
            this.callback();
        }
        if (this.isClose) {
            UIManager.getInstance().closeUI(ErrorPanel);
        }
    }
}
