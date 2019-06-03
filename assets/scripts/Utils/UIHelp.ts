import { UIManager } from "../Manager/UIManager";
import { TipUI } from "../UI/panel/TipUI";
import { OverTips } from "../UI/Item/OverTips";
import { AffirmTips } from "../UI/Item/AffirmTips";

export class UIHelp
{
    /**
     * 
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     */
    public static showTip(message: string) {
        let tipUI = UIManager.getInstance().getUI(TipUI) as TipUI;
        if (!tipUI) {
            UIManager.getInstance().openUI(TipUI, 205, () => {
                UIHelp.showTip(message);
            });
        }
        else {
            tipUI.showTip(message);
        }
    }

    /**
     * 显示OverTips
     *
     * @static
     * @param {number} type 1成功 2失败
     * @param {string} str 提示文字
     * @param {boolean} isClose 窗口是否可关闭
     * @param {*} callback 关闭时回调
     * @memberof UIHelp
     */
    public static showOverTips(type:number,str:string,isClose:boolean,callback:any, timeText: string)
    {
        let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
        if(!overTips)
        {
            UIManager.getInstance().openUI(OverTips, 200, ()=>{
                UIHelp.showOverTips(type,str,isClose,callback, timeText);
            });
        }
        else
        {
           overTips.init(type,str,isClose,callback);
        }
    }

    /**
     * 关闭OverTips
     *
     * @static
     * @memberof UIHelp
     */
    public static hideOverTips(){
        let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
        if(overTips){
           UIManager.getInstance().closeUI(OverTips);
        }
    }

    public static affirmTips(type:number,des:string,callback:any)
    {
        let _afferTips = UIManager.getInstance().getUI(AffirmTips) as AffirmTips;
        if(!_afferTips)
        {
            UIManager.getInstance().openUI(AffirmTips, 200, ()=>{
                UIHelp.affirmTips(type,des,callback);
            });
        }
        else
        {
            _afferTips.init(type,des,callback);
        }
    }
}

