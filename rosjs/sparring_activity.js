/* global log */
const pino = require("pino");
const minimist = require("minimist");
const BridgeHandler = require("./lib/bridgeHandler");

const argv = minimist(process.argv.slice(2));
global.log = pino();
const websocketUrl = "ws://" + argv.ros_master + ":9090/";
const ros = new BridgeHandler(websocketUrl, {
    showServiceResponse: true
});

ros.ws.on("open", () => {
    log.info("Connection open");
    init();
});

function init() {

    ros.subscribe("/festo/cobotv1_1/robot_status", data => {
        // console.log(JSON.stringify(data))
    });

    // subscribe to error topic
    // ros.subscribe("/festo_status", data => {
    // console.log("festo_status: " + JSON.stringify(data))
    // });

    resetCollision();

    poses.forEach((pose) => {

    })

    let i = 0;
    setInterval(() => {
            let poses = absoluteJointPoses

            var poseId = i % poses.length
            console.log(">>> moving to pose " + poseId);
            moveToAbsoluteJointPose(poses[poseId]);
            i++;
        },
        5000);
}

function resetCollision() {
    ros.call("/festo/cobotv1_1/set_mode", {
        sequence: 0,
        required_mode: 7
    }, {
        hideCall: true
    });
}

function moveToAbsoluteJointPose(jointPose) {
    ros.call("/festo/cobotv1_1/jog_joints", {
        joint_increment: jointPose,
        velocity_factor: 0.5,
        acceleration_factor: 0.5,
        relative_position: false,
        time_factor: 0.5
    }, {
        hideCall: true
    });
}

let absoluteJointPoses = [
    [-0.972759544849396, 0.842011630535126, 0.525173485279083, -0.459920525550842, -0.311721533536911, -0.23040871322155, -1.61112463474274],
    [-0.45693451166153, 0.846364200115204, 0.527738392353058, -0.464820146560669, -0.311230331659317, -0.23233450949192, -1.60969400405884],
    [-1.48576176166534, 0.831790685653687, 0.523841917514801, -0.443036943674088, -0.31352910399437, -0.220870584249496, -1.60924172401428]
]