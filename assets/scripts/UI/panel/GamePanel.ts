import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";

export class ReporteSubject {
    
}
export class ReporteAnswer {
    studentAnswer = [];//学生作答信息
}
export class ReporteLevelData {
    subject = null;
    studentAnswer = null;
    result: number = null;// 1正确  2错误  3重复作答  4未作答  5已作答  
}

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
                eventValue: this.reporteData()
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

    reporteData() {
        let isResult = 1;//是否有正确答案
        let isLavel = 1;//是否有关卡
        let levelData: Array<ReporteLevelData> = [];//关卡具体数据
        let result: number = null; // 1正确  2错误  3重复作答  4未作答  5已作答  （若有答错则错  若未答完则报错）


        return JSON.stringify({ "isResult": isResult, "isLavel": isLavel, "levelData": levelData, "result": result });
    }
}
