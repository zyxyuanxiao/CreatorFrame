import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { GameData } from "../../Data/GameData";
import ErrorPanel from "./ErrorPanel";
import GamePanel from "./GamePanel";
import { ConstValue } from "../../Data/ConstValue";
import { ListenerManager } from "../../Manager/ListenerManager";
import { ListenerType } from "../../Data/ListenerType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property(cc.Button)
    btnCheck: cc.Button = null;

    onLoad () {
        this.getNet();
    }

    start() {

    }


    setPanel() {//设置教师端界面
        
    }

    //检测输入内容
    onBtnCheckClicked() {
        UIManager.getInstance().showUI(GamePanel, () => {
            //教师端显示底栏以及顶栏状态
            if (ConstValue.IS_TEACHER) {
                ListenerManager.getInstance().trigger(ListenerType.ShowBottom);
                ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, { state: 1 });
            }
        });
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                if (Array.isArray(response.data)) {
                    this.setPanel();
                    return;
                }
                let content = JSON.parse(response.data.courseware_content);
                NetWork.courseware_id = response.data.courseware_id;
                if (NetWork.empty) {
                    //如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                } else {
                     if (content != null) {
                        if (content.CoursewareKey == ConstValue.CoursewareKey) {
                            this.setPanel();
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
            }
        }.bind(this), null);
    }


    //删除课件数据  一般为脏数据清理
    ClearNet() {
        let jsonData = { courseware_id: NetWork.courseware_id };
        NetWork.getInstance().httpRequest(NetWork.CLEAR, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp.showTip("答案删除成功");
            }
        }.bind(this), JSON.stringify(jsonData));
    }
}
