
import { BaseUI } from "../BaseUI";
import { Tools } from "../../UIComm/Tools";
import { UIManager } from "../../Manager/UIManager";

const { ccclass, property } = cc._decorator;
@ccclass
export class OverTips extends BaseUI {

    protected static className = "OverTips";

    @property(cc.Node)
    private NodeDes: cc.Node = null; //描述节点
    @property(cc.Label)
    private des: cc.Label = null;
    @property(cc.Button)
    private close: cc.Button = null;
    @property(sp.Skeleton)
    private sp_BgAnimator: sp.Skeleton = null; // 背景动画
    @property(sp.Skeleton)
    private sp_lightAnimator: sp.Skeleton = null; // 光动画

    private callback = null;
    private type: number;
    private isClose: boolean = true;
    start() {

    }

    /**
     * 
     * @param type 成功 1 失败 2
     * @param str 提示文字
     * @param isClose 窗口是否可关闭
     * @param callback 回调函数
     */
    init(type: number, str: string, isClose: boolean, callback: any = null) {
        this.type = type;
        this.callback = callback;
        this.isClose = isClose;
        Tools.playSpine(this.sp_BgAnimator, "fault", false);

        this.NodeDes.setScale(0.001, 0.001);
        if (type == 1) {
            this.Successful(str);
        } else if (type == 2) {
            this.failure(str);
        }
        this.close.node.active = isClose;
        this.TipsAnimatorScale(this.NodeDes);

    }

    //成功
    Successful(str: string) {
        this.des.node.active = true;
        this.sp_lightAnimator.node.active = true;
        // Tools.playSpine(this.sp_BgAnimator, "fault", false);
        Tools.playSpine(this.sp_BgAnimator, this.isClose ? "right" : "right_1", false);
        Tools.playSpine(this.sp_lightAnimator, "light", false);
        this.des.string = str;
        this.des.node.color = new cc.Color(39, 178, 187);
    }

    //失败
    failure(str: string) {
        this.des.node.active = true;
        this.sp_lightAnimator.node.active = false;
        Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.des.string = str;
        // this.des.node.color = new cc.Color(39, 178, 187);
    }

    OnClickClose() {
        if (!this.isClose) {
            //界面不关闭
        } else {
            UIManager.getInstance().closeUI(OverTips);
            if(this.callback){
                this.callback();
            }
        }
        // this.node.active = false;
    }

    //通用动画
    TipsAnimatorScale(nodeObj: cc.Node) {
        nodeObj.stopAllActions();
        var seq = cc.sequence(
            cc.delayTime(1),
            cc.scaleTo(0.2, 1, 1),
        );
        nodeObj.runAction(seq);
        // nodeObj.runAction(cc.scaleTo(0.2, 1, 1));

    }
}
