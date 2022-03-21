const mongoose = require("mongoose");

async function beginSession(req, res, next) {
    try {
        const session = await mongoose.startSession();

        session.startTransaction();
        req.addedSession = session;
        next();
    } catch (error) {
        console.log("Error faced from transaction: " + error);
        res.send("Error faced while starting the session");
    }
}

async function saveTranscation(req, res) {
    try {
        await req.addedSession.commitTransaction();
        console.log("Transaction committed");
    } catch (error) {
        console.log("Error faced from transaction: " + localError);
        res.send("Error faced while committing the transcation");
    } finally {
        req.addedSession.endSession();
    }
}

async function cancelTranscation(error, req, res) {
    try {
        console.log("Error faced from api method: " + error);
        await req.addedSession.abortTranscation();
    } catch (localError) {
        console.log("Error faced from transaction: " + localError);
        res.send("Error faced while aborting the transcation");
    } finally {
        req.addedSession.endSession();
    }
}

module.exports = { beginSession, saveTranscation, cancelTranscation };