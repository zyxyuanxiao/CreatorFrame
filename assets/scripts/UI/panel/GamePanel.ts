import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import { GameData } from "../../Data/GameData";
import { ConstValue } from "../../Data/ConstValue";
import { ListenerManager } from "../../Manager/ListenerManager";
import { ListenerType } from "../../Data/ListenerType";
import { UIHelp } from "../../Utils/UIHelp";
import { UIManager } from "../../Manager/UIManager";
import { TipUI } from "./TipUI";
import { OverTips } from "../Item/OverTips";
import SubmissionPanel from "./SubmissionPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";

    bFinished = false;

    onLoad() {
        ListenerManager.getInstance().add(ListenerType.OnClickReturn, this, this.onBtnBottomBackClicked);
        ListenerManager.getInstance().add(ListenerType.OnClicktijiao, this, this.onBtnBottomSavelicked);
    }

    start() {
    }

    onDestroy() {
        ListenerManager.getInstance().remove(ListenerType.OnClickReturn, this, this.onBtnBottomBackClicked);
        ListenerManager.getInstance().remove(ListenerType.OnClicktijiao, this, this.onBtnBottomSavelicked);
    }

    onShow() {
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null && content.CoursewareKey == ConstValue.CoursewareKey) {
                    this.setPanel();
                }
            }
        }.bind(this), null);
    }

    //教师端  返回编辑器界面
    onBtnBottomBackClicked() {
        UIManager.getInstance().closeUI(TipUI);
        UIManager.getInstance().closeUI(OverTips);
        UIManager.getInstance().closeUI(GamePanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, { state: 0 });
    }
    //教师端  上传题目
    onBtnBottomSavelicked() {
        if (this.bFinished) {
            UIManager.getInstance().openUI(SubmissionPanel, 201);
        } else {
            UIHelp.showTip("请答对所有题目之后进行保存");
        }
    }
}
