const mongoose = require("mongoose");

async function beginSession(context) {
    try {
        const session = await mongoose.startSession();

        session.startTransaction();
        context.params.addedSession = session;
        console.log("session" + req.addedSession);
        next();
    } catch (error) {
        console.log("Error faced from transaction: " + error);
    }

    return context;
}

async function saveTranscation(context) {
    try {
        console.log("session commit" + req.addedSession);
        await context.params.addedSession.commitTransaction();
        console.log("Transaction committed");
    } catch (error) {
        console.log("Error faced from transaction: " + localError);
    } finally {
        context.params.addedSession.endSession();
    }

    return context;
}

async function cancelTranscation(context) {
    try {
        console.log("Error faced from api method: " + error);
        await context.params.addedSession.abortTranscation();
    } catch (localError) {
        console.log("Error faced from transaction: " + localError);
    } finally {
        context.params.addedSession.endSession();
    }

    return context;
}

module.exports = { beginSession, saveTranscation, cancelTranscation };