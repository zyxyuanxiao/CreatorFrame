import { BaseUI, UIClass } from "../BaseUI";
import { ConstValue } from "../../Data/ConstValue";
import TeacherPanel from "./TeacherPanel";
import GamePanel from "./GamePanel";
import { UIManager } from "../../Manager/UIManager";
import { NetWork } from "../../Http/NetWork";
import ErrorPanel from "./ErrorPanel";
import { GameData } from "../../Data/GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingUI extends BaseUI {

    protected static className = "LoadingUI";

    @property(cc.ProgressBar)
    private progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    private progressLabel: cc.Label = null;
    @property(cc.Node)
    private dragonNode: cc.Node = null;

    onLoad() {
        NetWork.getInstance().GetRequest();

        let onProgress = (completedCount: number, totalCount: number, item: any) => {
            this.progressBar.progress = completedCount / totalCount;
            let value = Math.round(completedCount / totalCount * 100);
            if (ConstValue.IS_EDITIONS) {
                courseware.page.sendToParent('loading', value);
            }
            this.progressLabel.string = value.toString() + '%';
            let posX = completedCount / totalCount * 609 - 304;
            this.dragonNode.x = posX;
        };
        if (ConstValue.IS_EDITIONS) {
            courseware.page.sendToParent('load start');
        }
        let openPanel: UIClass<BaseUI> = ConstValue.IS_TEACHER ? TeacherPanel : GamePanel;
        let openUI = () => {
            UIManager.getInstance().openUI(openPanel, 0, () => {
                if (ConstValue.IS_EDITIONS) {
                    courseware.page.sendToParent('load end');
                    courseware.page.sendToParent('start');
                }
                this.node.active = false;
            }, onProgress);
        }

        this.loadGameData(openUI);
    }

    loadGameData(callback: any) {
        cc.loader.loadRes("GameData", cc.JsonAsset, function (err, jsonAssert) {
            if (!err) {
                // cc.log(jsonAssert);
               
                if (!ConstValue.IS_TEACHER) {
                    this.getRemoteDataByCoursewareID(callback);
                } else {
                    callback();
                }

            } else {
                this.node.zIndex = -1;
                UIManager.getInstance().openUI(ErrorPanel, 1000, () => {
                    (UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel).setPanel("游戏数据加载失败,请联系技术老师解决!", "", "", "确定");
                });
            }
        }.bind(this))
    }

    getRemoteDataByCoursewareID(callback: Function) {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            // console.log("消息返回" + response);
            if (!err) {
                if (Array.isArray(response.data)) {
                    callback()
                    return;
                }
                let content = JSON.parse(response.data.courseware_content);
                NetWork.courseware_id = response.data.courseware_id;
                if (NetWork.empty) {
                    //如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                } else {
                    if (content != null && content.CoursewareKey == ConstValue.CoursewareKey) {
                        // cc.log("拉取到数据：")
                        // cc.log(content);
                        callback();
                    }
                }
            }
        }.bind(this), null);
    }
}