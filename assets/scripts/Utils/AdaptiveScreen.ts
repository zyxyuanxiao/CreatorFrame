const { ccclass, property } = cc._decorator;
/**
 * 自适应代码
 */
@ccclass
export default class AdaptiveScreen extends cc.Component {
    /**
    * 全屏背景图片，用于自适应
    */
    @property({
        type: cc.Node,
        tooltip: "全屏背景图片，用于自适应"
    })
    bgNode: cc.Node = null;
    /**舞台设计宽度 */
    @property
    public viewWidth: number = 640;
    /**舞台设计高度 */
    @property
    public viewHeight: number = 1136;

    /**当前场景 舞台 */
    public stage: cc.Node;
    onLoad() {
        this.screenAdapter();
    }
    start() {
        this.viewUp();
    }
    /**
    * 自适应
    */
    public screenAdapter() {
        if (cc.Canvas.instance) {
            this.stage = cc.Canvas.instance.node;
            let canvas = cc.Canvas.instance;
            let winSize: cc.Size = cc.view.getFrameSize();
            // console.log(cc.winSize);
            // console.log(cc.view.getCanvasSize());
            // console.log(cc.view.getFrameSize());
            // console.log(cc.view.getVisibleSize());
            if (winSize.width / winSize.height < canvas.designResolution.width / canvas.designResolution.height) {
                canvas.fitWidth = true;
                canvas.fitHeight = false;
            }
            else {
                canvas.fitHeight = true;
                canvas.fitWidth = false;
            }
        }
    }
    viewUp() {
        let winSize: cc.Size = cc.winSize;
        let scaleX = winSize.width / this.viewWidth;
        let scaleY = winSize.height / this.viewHeight;

        this.bgNode.scale = 1 * Math.max(scaleX, scaleY);
    }
    // update (dt) {}
}
