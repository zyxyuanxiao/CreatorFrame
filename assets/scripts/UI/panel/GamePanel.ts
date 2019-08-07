import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { ConstValue } from "../../Data/ConstValue";
import { UIHelp } from "../../Utils/UIHelp";
import { UIManager } from "../../Manager/UIManager";
import { TipUI } from "./TipUI";
import { OverTips } from "../Item/OverTips";
import { ListenerType } from "../../Data/ListenerType";
import { ListenerManager } from "../../Manager/ListenerManager";
import SubmissionPanel from "./SubmissionPanel";
import ErrorPanel from "./ErrorPanel";

export class ReporteSubject {

}
export class ReporteAnswer {
    answer = [];//学生作答信息
}
export class ReporteLevelData {
    subject = null;
    answer = null;
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
        if (!DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: this.reporteData()
            });
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

    getRemoteDataByCoursewareID(callback: Function) {
        if (ConstValue.IS_TEACHER) {
            callback();
            return;
        }

        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                if (Array.isArray(response.data)) {
                    callback()
                    return;
                }
                let content = JSON.parse(response.data.courseware_content);
                if (content != null) {
                    if (content.CoursewareKey == ConstValue.CoursewareKey) {
                        // cc.log("拉取到数据：")
                        // cc.log(content);
                        callback();
                    } else {
                        UIManager.getInstance().openUI(ErrorPanel, 1000, () => {
                            (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel(
                                "CoursewareKey错误,请联系客服！",
                                "", "", "确定");
                        });
                        return;
                    }
                }
            }
        }.bind(this), null);
    }

    reporteData() {
        DataReporting.isRepeatReport = true;

        let isResult = 1;//是否有正确答案
        let isLavel = 1;//是否有关卡
        let levelData: Array<ReporteLevelData> = [];//关卡具体数据
        let result: number = null; // 1正确  2错误  3重复作答  4未作答  5已作答  （若有答错则错  若未答完则报错）

        if (this.bFinished) {
            result = 1;
        } else if (this.isFirstStart == true) {
            result = 4;
        } else {
            result = 2;
        }

        let subject = new ReporteSubject();

        let answer = new ReporteAnswer();

        let result_: number = null;


        let levelData_ = new ReporteLevelData();
        levelData_.subject = JSON.stringify(subject);
        levelData_.answer = JSON.stringify(answer);
        levelData_.result = result_;

        levelData.push(levelData_);

        return JSON.stringify({ "isResult": isResult, "isLavel": isLavel, "levelData": levelData, "result": result });
    }
}
