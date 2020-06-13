const robot = require("rebot")

/**
 * 机器人的核心调控类
 */
class Core {
    ROBOT;
    /**
     * 
     * @param {robot} robot 初始化完毕的robot类
     * @param {Object} config 设置类
     * @param {Int16Array} config.timeout websocket的超时时间
     * @param {Blob} config.websocket 
     */
    constructor(robot,config){
        if(robot.GetInit == true){
            this.ROBOT = robot;
        } else {
            throw "robot Dont Init";
        }
        
    }
}