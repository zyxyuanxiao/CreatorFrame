const { ccclass, property } = cc._decorator;

@ccclass
export class Tip extends cc.Component {

    @property(cc.Node)
    private neiRongNode: cc.Node = null;

    @property(cc.Label)
    private tipLabel: cc.Label = null;
    private ready: boolean = true;

    public playTip(message: string) {
        this.neiRongNode.active = true;
        this.node.stopAllActions();
        this.ready = false;
        this.tipLabel.string = message;
        this.reset();
        let action0 = cc.moveTo(0.5, 0, 128);
        let action1 = cc.fadeIn(0.5);
        let action4 = cc.fadeOut(0.5);
        let action2 = cc.spawn(action0, action4);
        let action3 = cc.delayTime(1);
        let callback = cc.callFunc(
            function () {
                this.ready = true;
            }
            , this
        );

        let action = cc.sequence(action3, action2, callback);
        this.node.runAction(action);
    }

    public isReady(): boolean {
        return this.ready;
    }

    public reset() {
        this.node.setPosition(0, 0);
        this.node.opacity = 255;
    }
}