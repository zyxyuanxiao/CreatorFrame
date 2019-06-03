const {ccclass, property} = cc._decorator;
import { ListenerManager } from "../../Manager/ListenerManager";
import { ListenerType } from "../../Data/ListenerType";

@ccclass
export default class FootNoode extends cc.Component {

    protected static className = "FootNoode";

   @property(cc.Button)
   btn_return:cc.Button = null;
   @property(cc.Button)
   btn_tijiao:cc.Button = null;

   onLoad () {
   }

    start () {
        ListenerManager.getInstance().add(ListenerType.ShowBottom, this, this.show);
    }

    OnClickReturn(){
        ListenerManager.getInstance().trigger(ListenerType.OnClickReturn);
        this.btn_return.node.active = false;
        this.btn_tijiao.node.active = false;
    }

    OnClickTijiao(){
        ListenerManager.getInstance().trigger(ListenerType.OnClicktijiao);
    }

    show() {
        this.btn_return.node.active = true;
        this.btn_tijiao.node.active = true;
    }
    // update (dt) {}
}
