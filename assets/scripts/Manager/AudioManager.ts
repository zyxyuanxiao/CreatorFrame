import { ConstValue } from "../Data/ConstValue";

export class AudioManager
{
    private static instance: AudioManager = null;

    private bgm: string = "";

    public static getInstance(): AudioManager
    {
        if(this.instance == null)
        {
            this.instance = new AudioManager();
        }
        return this.instance;
    }

    /**
     * 播放音频文件
     * @param soundName 音频名字
     * @param loop 是否循环
     * @param volume 音量大小
     * @param audioIdCbk 回传播放的音频的AudioID
     * @param endCbk 音频播放结束的回调
     */
    public playSound(soundName: string, loop?: boolean, volume?: number, audioIdCbk:Function = null, endCbk:Function = null)
    {
        // if(GameDataManager.getInstance().getGameData().playerInfo.closeAudio)
        // {
        //     return;
        // }
        let path = ConstValue.AUDIO_DIR + soundName;
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if(err)
            {
                cc.error(err);
                return;
            }
            let audioID = cc.audioEngine.play(clip, loop?loop:false, volume?volume:1);
            //LogWrap.log('playSound: ', path)
            if(audioIdCbk){
                audioIdCbk(audioID)
            }
            if(endCbk){
                cc.audioEngine.setFinishCallback(audioID, endCbk)
            }
		});
    }

    /**
     * 停止播放指定的音频
     * @param audioId 
     */
    public stopAudio(audioId:number){
        cc.audioEngine.stop(audioId)
    }
    
    /**
     * 停止正在播放的所有音频
     */
    public stopAll()
    {
        cc.audioEngine.stopAll();
    }

    /**
     * 暂停现在正在播放的所有音频
     */
    public pauseAll()
    {
        cc.audioEngine.pauseAll();
    }

    /**
     * 恢复播放所有之前暂停的所有音频
     */
    public resumeAll()
    {
        cc.audioEngine.resumeAll();
    }

    /**
     * 播放背景音乐
     * @param soundName 背景音乐文件名
     */
    public playBGM(soundName: string)
    {
        if(this.bgm == soundName)
        {
            return;
        }
        this.bgm = soundName;
        // if(GameDataManager.getInstance().getGameData().playerInfo.closeAudio)
        // {
        //     return;
        // }
        cc.audioEngine.stopMusic();
        let path = ConstValue.AUDIO_DIR + soundName;
        //cc.audioEngine.play(cc.url.raw(path), loop?loop:false, volume?volume:1);
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if(err)
            {
                cc.error(err);
                return;
            }
		    cc.audioEngine.playMusic(clip, true);
		});
    }

    /**
     * 重新开始播放背景音乐
     */
    public resumeBGM()
    {
        cc.audioEngine.stopMusic();
        let path = ConstValue.AUDIO_DIR + this.bgm;
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if(err)
            {
                cc.error(err);
                return;
            }
		    cc.audioEngine.playMusic(clip, true);
		});
    }
}