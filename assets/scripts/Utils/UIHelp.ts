import { UIManager } from "../Manager/UIManager";
import { TipUI } from "../UI/panel/TipUI";
import { AffirmTips } from "../UI/Item/affirmTips";
import { OverTips } from "../UI/Item/OverTips";

export class UIHelp {
    /**
     * 
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     */
    public static showTip(message: string) {
        let tipUI = UIManager.getInstance().getUI(TipUI) as TipUI;
        if (!tipUI) {
            UIManager.getInstance().openUI(TipUI, 220, () => {
                UIHelp.showTip(message);
            });
        }
        else {
            tipUI.showTip(message);
        }
    }

     /**
     * 结束tip
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     * @param {boolean} showClose    是否显示关闭按钮
     */
    public static showOverTip(type:number, str:string="",callback:Function =null, showClose: boolean = true) {
        let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
        if (!overTips) {
            UIManager.getInstance().openUI(OverTips, 200, () => {
                UIHelp.showOverTip(type, str,callback, showClose);
            });
        }
        else {
            overTips.init(type, str,callback, showClose);
        }
    }

     /**
     * 二次确认框
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     */
    public static AffirmTip(type: number, des: string, callback: any, btnCloselDes?: string, btnOkDes?: string) {
        let overTips = UIManager.getInstance().getUI(AffirmTips) as AffirmTips;
        if (!overTips) {
            UIManager.getInstance().openUI(AffirmTips, 200, () => {
                UIHelp.AffirmTip(type, des,callback,btnCloselDes,btnOkDes);
            });
        }
        else {
            overTips.init(type, des,callback,btnCloselDes,btnOkDes);
        }
    }


}

