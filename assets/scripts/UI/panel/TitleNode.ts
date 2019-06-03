import { ListenerManager } from "../../Manager/ListenerManager";
import { ListenerType } from "../../Data/ListenerType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    bianJiLabel: cc.Label = null;
    @property(cc.Label)
    jianYanLabel: cc.Label = null;
    @property(cc.Node)
    tiaoNode: cc.Node = null;

    heiSe = cc.color(0, 0, 0);
    huiSe = cc.color(127, 127, 127);

    start() {
        this.bianJiLabel.node.color = this.heiSe;
        this.jianYanLabel.node.color = this.huiSe;
        this.tiaoNode.color = this.huiSe;
        ListenerManager.getInstance().add(ListenerType.OnEditStateSwitching, this, this.onStateSwitching);
    }

    onStateSwitching(event) {
        if (event.state == 0) {
            this.jianYanLabel.node.color = this.huiSe;
            this.tiaoNode.color = this.huiSe;
        } else {
            this.jianYanLabel.node.color = this.heiSe;
            this.tiaoNode.color = this.heiSe;
        }
    }


}
