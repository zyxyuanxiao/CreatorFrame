import { BaseUI } from "../BaseUI";
import { Tools } from "../../UIComm/Tools";
import { UIManager } from "../../Manager/UIManager";
import { AudioManager } from "../../Manager/AudioManager";

const { ccclass, property } = cc._decorator;
@ccclass
export class OverTips extends BaseUI {

    protected static className = "OverTips";

    @property(cc.Label)
    private label_tip: cc.Label = null;

    @property(sp.Skeleton)
    private spine_false: sp.Skeleton = null;
    @property(sp.Skeleton)
    private spine_false_noBtn: sp.Skeleton = null;
    @property(sp.Skeleton)
    private spine_true_noBtn: sp.Skeleton = null;
    @property(sp.Skeleton)
    private spine_true: sp.Skeleton = null;
    @property(sp.Skeleton)
    private spine_complete: sp.Skeleton = null;

    @property(cc.Node)
    private node_close: cc.Node = null;

    private callback = null;

    constructor() {
        super();
    }

    start() {
        this.node_close.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    }

    onDisable() {
        this.node_close.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    }

    /**
     设置显示内容
     @param {number} type          0: 错误  1：答对了  2：闯关成功(一直显示不会关闭)
     @param {string} str           提示内容
     @param {boolean} showClose    是否显示关闭按钮
     */
    init(type: number, str: string = "", callback: Function, showClose: boolean = true): void {
        this.callback = callback;
        if (showClose == true) {
            this.spine_false.node.active = type == 0;
            this.spine_true.node.active = type == 1;
            this.spine_false_noBtn.node.active = false;
            this.spine_true_noBtn.node.active = false;
        } else {
            this.spine_false_noBtn.node.active = type == 0;
            this.spine_true_noBtn.node.active = type == 1;
            this.spine_false.node.active = false;
            this.spine_true.node.active = false;
        }
        this.node_close.active = showClose;
        this.spine_complete.node.active = type == 2;
        this.label_tip.string = str;
        this.label_tip.node.active = type != 2;
        switch (type) {
            case 0:
                Tools.playSpine(showClose ? this.spine_false : this.spine_false_noBtn, "false", false, this.delayClose.bind(this));
                AudioManager.getInstance().playSound("sfx_genneg", false, 1);
                break;
            case 1:
                Tools.playSpine(showClose ? this.spine_true : this.spine_true_noBtn, "true", false, this.delayClose.bind(this));
                AudioManager.getInstance().playSound("sfx_genpos", false, 1);
                break;
            case 2:
                Tools.playSpine(this.spine_complete, "in", false, function () {
                    Tools.playSpine(this.spine_complete, "stand", true, this.delayClose.bind(this));
                }.bind(this));
                AudioManager.getInstance().playSound("sfx_genpos", false, 1);
                break;
        }
        let endPos = this.label_tip.node.position;
        let framePos_1 = cc.v2(endPos.x, endPos.y - 72.8);
        let framePos_2 = cc.v2(endPos.x, endPos.y + 12);
        let framePos_3 = cc.v2(endPos.x, endPos.y - 8);
        let framePos_4 = cc.v2(endPos.x, endPos.y + 7.3);
        this.label_tip.node.position = framePos_1;
        this.label_tip.node.runAction(cc.sequence(cc.moveTo(0.08, framePos_2), cc.moveTo(0.08, framePos_3), cc.moveTo(0.08, framePos_4), cc.moveTo(0.06, endPos)));
    }

    delayClose(): void {
        this.scheduleOnce(function () { this.onClickClose() }.bind(this), 0);
    }

    onClickClose(event?, customEventData?): void {
        if (event) AudioManager.getInstance().playSound("sfx_buttn", false, 1);
        UIManager.getInstance().closeUI(OverTips);
    }
}
