const robot = require("rebot")

/**
 * 机器人的核心调控类
 */
class Core {
    /**
     * @var {robot}
     */
    ROBOT = [];
    /**
     * 
     * @param {Object} config 设置类
     * @param {Int16Array} config.timeout websocket的超时时间
     * @param {Blob} config.websocket 
     */
    constructor(config){
        
    }

    addRobot(robot){
        if(robot.isInit == true) {
            ROBOT.push(robot);
        } else {
            throw "robot dont init";
        }

        return this;
    }

    async Init(){
        
    }
}