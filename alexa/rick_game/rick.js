'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

let lastResultInMilliseconds = 0;
let newResultInMilliseconds = 0;

const GAME_OPTIONS = {
    NONE: 0,
    START: 1,
    RESULTS: 2
}

const S3 = {
    BUCKET: "ric.game",
    KEYS: {
        LAST_RESULT: "last_result",
        NEW_RESULT: "new_result",
        GAME_START_TIME: "game_start_time"
    }
}

const randomResults = [
    "Hey, that was great, you were even better then the last time.",
    "Not bad! You were as fast as the last time.",
    "Oh! You were slower than the last time. I bet you will do better next time."
]

let currentLocale = 'en-US'

let locales = {
    output_welcome: "Welcome to your personal Robot Interaction Companion. Please say: start, to start the game. Or: results, to get the results of the last game",
    output_session_end: "Thank you.",
    reprompt_output: "Please say: start, to start the game. Or: results, to get the results of the last game.",
    output_game_option: function (gameOption) {
        if (gameOption === GAME_OPTIONS.START) {
            return `Three! Two! One! GO!`;
        }
        else if (gameOption === GAME_OPTIONS.RESULTS) {
            const rand = Math.floor(Math.random() * randomResults.length);
            return randomResults[rand];
        }
        else {
            return "Sorry, I did not understand you. Please say: start, to start the game. Or: results, to get the results of the last game."
        }
    }
};

function saveStartGameTimestampToS3() {
    let startTime = new Date();
    startTime.setSeconds(startTime.getSeconds() + 5);
    var params = {
        Bucket : S3.BUCKET,
        Key : S3.KEYS.GAME_START_TIME,
        Body : startTime.toString()
    }
    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else     console.log(data);
    });
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = locales.output_welcome;
    const repromptText = locales.reprompt_output;
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = locales.output_session_end;
    const shouldEndSession = true;
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function getGameOption(gameOptionSlotValue) {
    switch (gameOptionSlotValue) {
        case "start":
            return GAME_OPTIONS.START;
        case "results":
            return GAME_OPTIONS.RESULTS;
        default:
            return GAME_OPTIONS.NONE;
    }
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function handleGame(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    const gameOption = getGameOption(intent.slots.option.value);
    console.log(gameOption);

    if (gameOption === GAME_OPTIONS.START) {
        saveStartGameTimestampToS3();
    } else if (gameOption === GAME_OPTIONS.RESULTS) {
        console.log(`"${lastResultInMilliseconds}"`);
        console.log(`"${newResultInMilliseconds}"`);
    } else {
        shouldEndSession = false;
    }
    speechOutput = locales.output_game_option(gameOption)
    repromptText = locales.reprompt_output;

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'StartGameIntent') {
        handleGame(intent, session, callback)
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        const locale = event.request.locale;
        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
