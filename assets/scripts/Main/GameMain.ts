
const { ccclass, property } = cc._decorator;

@ccclass
export class GameMain extends cc.Component {

    onLoad() {
        let loading = document.getElementById("loading-full");
        if (loading) {
            loading.style.display = "none";
        }
    }

    start() {
    }

    update(dt) {

    }
}