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
            UIManager.getInstance().openUI(TipUI, 200, () => {
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
     */
    public static showOverTip(type:number, str:string="",callback:Function =null) {
        let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
        if (!overTips) {
            UIManager.getInstance().openUI(OverTips, 210, () => {
                UIHelp.showOverTip(type, str,callback);
            });
        }
        else {
            overTips.init(type, str,callback);
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
            UIManager.getInstance().openUI(AffirmTips, 210, () => {
                UIHelp.AffirmTip(type, des,callback,btnCloselDes,btnOkDes);
            });
        }
        else {
            overTips.init(type, des,callback,btnCloselDes,btnOkDes);
        }
    }


}

