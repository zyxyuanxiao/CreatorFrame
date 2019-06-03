export class ConstValue {
    public static readonly IS_EDITIONS = false;//是否为发布版本，用于数据上报 及 log输出控制
    public static readonly IS_TEACHER = true;//是否为教师端版本
    public static readonly CONFIG_FILE_DIR = "config/";
    public static readonly PREFAB_UI_DIR = "prefab/ui/panel/";
    public static readonly AUDIO_DIR = "audio/";
    public static readonly CoursewareKey = "";//每个课件唯一的key 24位随机字符串 可用随机密码生成器来生成。
}