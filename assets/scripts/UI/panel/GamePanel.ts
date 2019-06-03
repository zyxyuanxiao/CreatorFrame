import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";

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
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    }
    
    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify({})
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: 0 });
    }

    onDestroy() {
        ListenerManager.getInstance().remove(ListenerType.OnClickReturn, this, this.onBtnBottomBackClicked);
        ListenerManager.getInstance().remove(ListenerType.OnClicktijiao, this, this.onBtnBottomSavelicked);
    }

    onShow() {
    }

    setPanel() {

    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    this.setPanel();
                }
            } else {
                this.setPanel();
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
