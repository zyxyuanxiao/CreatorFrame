// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**美术提供的位移动画参数 */
export class ArtMoveParam{
    /**时刻，ms */
    time: number = 0;
    /**位置 */
    pos:cc.Vec2 = cc.Vec2.ZERO;

    /**
     * @param t 时刻，ms
     * @param p 位置
     */
    constructor(t:number, p:cc.Vec2){
        this.time = t;
        this.pos = p;
    }
}

const {ccclass, property} = cc._decorator;

@ccclass
export class Tools  {
   /**
     * 播放spine动画
     * @param {*} sp_Skeleton 动画文件
     * @param {*} animName 动作名称
     * @param {*} loop 是否循环
     * @param {*} callback 播放完毕回调
     */
    public static playSpine(sp_Skeleton:sp.Skeleton,animName:string,loop:boolean,callback:any=null) {
        // sp_Skeleton.premultipliedAlpha=false;//这样设置在cocos creator中才能有半透明效果
        
        // let spine = this.node.getComponent(sp.Skeleton);
        let track = sp_Skeleton.setAnimation(0, animName, loop);
        if (track) {
            // 注册动画的结束回调
            sp_Skeleton.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === animName && callback&&callback!=null) {
                   // console.log("动画回调");
                    callback(); // 动画结束后执行自己的逻辑
                }
            });
        }
    }

    //参数获取
    public static getQueryVariable(variable:string) {
        var query = window.location.href;
        var vars = query.split("?");
        if(vars.length<2)
        return false;
        var vars = vars[1].split("&");
       
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }

    /**
     * 使节点直接运行美术提供的位移动画参数，
     * (节点当前位置对应美术参数列表最后一个参数位置，
     * 函数内部会做相对位置的处理)
     * @param node 
     * @param params 
     * @param endCbk 
     */
    public static runArtMoveSequence(node:cc.Node, params:Array<ArtMoveParam>, endCbk:Function = null){
        let nodeOriPos = node.getPosition();
        //节点实际坐标与美术参数坐标的差
        let gapPos = nodeOriPos.sub(params[params.length - 1].pos);
        function transArtPosToNodePos(artPos:cc.Vec2){
            return artPos.add(gapPos);
        }
        node.setPosition(transArtPosToNodePos(params[0].pos));

        if(params.length <= 1){
            if(endCbk) endCbk();
            return;
        }

        let actArray:Array<cc.FiniteTimeAction> = []
        for(let i = 1; i < params.length - 1; i++){
            let duration = (params[i].time - params[i - 1].time) * 0.001;
            actArray.push(cc.moveTo(duration, transArtPosToNodePos(params[i].pos)));
        }
        if(endCbk){
            actArray.push(cc.callFunc(endCbk));
        }

        node.runAction(cc.sequence(actArray));
    }

    /**获取当前时间戳，毫秒 */
    public static getNowTimeMS(){
        return (new Date()).getTime()
    }

    /**获取当前时间戳，秒 */
    public static getNowTimeS(){
        return Math.floor((new Date()).getTime()*0.001)
    }

    /**
     * 格式化时间， eg: 100 ->  '01:40'
     * @param time 时长，秒
     */
    public static getFormatTime(time:number){
        let min:any = Math.floor(time/60)
        if(min < 10){
            min = '0' + min 
        }
        let sec:any = time%60
        if(sec < 10){
            sec = '0' + sec
        }
        return min + ':' + sec
    }
}
