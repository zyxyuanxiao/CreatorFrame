import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { ConstValue } from "../../Data/ConstValue";
import ErrorPanel from "./ErrorPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SubmissionPanel extends BaseUI {

    protected static className = "SubmissionPanel";
    start() {

    }

    onQueDingBtnClick(event) {
        this.DetectionNet();
    }

    onQuXiaoBtnClick(event) {
        UIManager.getInstance().closeUI(SubmissionPanel);
    }

    //提交或者修改答案
    DetectionNet() {
        if (!NetWork.title_id) {
            UIManager.getInstance().openUI(ErrorPanel, 1000, () => {
                (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel("titleId为空,请联系技术老师解决！\ntitleId=" + NetWork.title_id, "", "", "确定");
            });
            return;
        }
        let data = JSON.stringify({ CoursewareKey: ConstValue.CoursewareKey });
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                if (response.data.courseware_content == null || response.data.courseware_content == "") {
                    this.AddNet(data);
                } else {
                    NetWork.courseware_id = response.data.courseware_id;
                    let res = JSON.parse(response.data.courseware_content)
                    if (!NetWork.empty) {
                        if (res.CoursewareKey == ConstValue.CoursewareKey) {
                            this.ModifyNet(data);
                        } else {
                            UIManager.getInstance().openUI(ErrorPanel, 1000, () => {
                                (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel("该titleId已被使用,请联系技术老师解决！\ntitleId=" + NetWork.title_id, "", "", "确定");
                            });
                        }
                    }
                }
            }
        }.bind(this), null);
    }

    //添加答案信息
    AddNet(gameDataJson) {
        let data = { title_id: NetWork.title_id, courseware_content: gameDataJson, is_result: 1, is_lavel: 0 };
        NetWork.getInstance().httpRequest(NetWork.ADD, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp.showTip("答案提交成功");
                UIManager.getInstance().closeUI(SubmissionPanel);
            }
        }.bind(this), JSON.stringify(data));
    }

    //修改课件
    ModifyNet(gameDataJson) {
        let jsonData = { courseware_id: NetWork.courseware_id, courseware_content: gameDataJson, is_result: 1, is_lavel: 0 };
        NetWork.getInstance().httpRequest(NetWork.MODIFY, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp.showTip("答案修改成功");
                UIManager.getInstance().closeUI(SubmissionPanel);
            }
        }.bind(this), JSON.stringify(jsonData));
    }
}
