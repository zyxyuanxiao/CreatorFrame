import { BaseUI } from "../BaseUI";
import { Tip } from "../Item/Tip";

const { ccclass, property } = cc._decorator;

@ccclass
export class TipUI extends BaseUI {

    protected static className = "TipUI";

    @property(cc.Prefab)
    private tipPrefab: cc.Prefab = null;
    private tipPool: Tip[] = [];

    showTip(message: string) {
        for (let j = 0; j < this.tipPool.length; j++) {
            if (!this.tipPool[j].isReady()) {
                this.tipPool[j].reset();
                this.tipPool[j].playTip(message);
                return;
            }
        }
        for (let i = 0; i < this.tipPool.length; ++i) {
            if (this.tipPool[i] != null && this.tipPool[i].isReady()) {
                this.tipPool[i].node.setSiblingIndex(200);
                this.tipPool[i].playTip(message);
                return;
            }
        }
        cc.log("create tip");
        let TipNode = cc.instantiate(this.tipPrefab);
        TipNode.parent = this.node;
        let tip = TipNode.getComponent(Tip);
        this.tipPool.push(tip);
        tip.playTip(message);
    }
}