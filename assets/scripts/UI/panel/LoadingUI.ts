import { BaseUI, UIClass } from "../BaseUI";
import { ConstValue } from "../../Data/ConstValue";
import TeacherPanel from "./TeacherPanel";
import GamePanel from "./GamePanel";
import { UIManager } from "../../Manager/UIManager";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { TimeManager } from "../../Manager/TimeManager";

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

    private isLoadStart = false;

    onLoad() {
        NetWork.getInstance().GetRequest();


        let onProgress = (completedCount: number, totalCount: number, item: any) => {
            if (!this.isLoadStart) {
                this.isLoadStart = true;
                NetWork.getInstance().LogJournalReport("ResLoadStart", { curTime: TimeManager.getInstance().getNowFormatDate() });
            }
            this.progressBar.progress = completedCount / totalCount;
            let value = Math.round(completedCount / totalCount * 100);

            DataReporting.getInstance().dispatchEvent('loading', value);
            this.progressLabel.string = value.toString() + '%';
            let posX = completedCount / totalCount * 609 - 304;
            this.dragonNode.x = posX;
        };

        DataReporting.getInstance().dispatchEvent('load start');

        let openPanel: UIClass<BaseUI> = ConstValue.IS_TEACHER ? TeacherPanel : GamePanel;
        UIManager.getInstance().openUI(openPanel, 0, () => {
            NetWork.getInstance().LogJournalReport("ResLoadEnd", { curTime: TimeManager.getInstance().getNowFormatDate() });
            DataReporting.getInstance().dispatchEvent('load end');
            DataReporting.getInstance().dispatchEvent('start');
            this.node.active = false;
        }, onProgress);
    }
}