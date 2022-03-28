const mongoose = require("mongoose");

async function beginSession(context) {
    console.log("BEFORE HOOK--------app");
    let count = context.app.get('sessionCount');
    console.log("BEFORE HOOK sessionCount" + count);

    try {
        if (count === 0) {
            const session = await mongoose.startSession();

            session.startTransaction();
            context.params.mongoose = {
                runValidators: true,
                setDefaultsOnInsert: true,
                session: session
            };
            console.log("SESSION STARTED");
        }
        context.app.set('sessionCount', ++count);

    } catch (error) {
        console.log("Error faced from transaction: " + error);
    }

    return context;
}

async function saveTranscation(context) {
    console.log("AFTER HOOK--------app");
    let count = context.app.get('sessionCount');
    console.log("AFTER HOOK sessionCount" + count);
    context.app.set('sessionCount', --count);

    try {
        if (count === 0) {
            await context.params.mongoose.session.commitTransaction();
            console.log("TRANSACTION COMMITED");
            context.params.mongoose.session.endSession();
            console.log("SESSION ENDED");
        }
    } catch (localError) {
        console.log("Error faced from COMMITTING transaction: " + localError);
        cancelTranscation(context);
    }

    return context;
}

async function cancelTranscation(context) {
    console.log("ERROR HOOK--------app");
    let count = context.app.get('sessionCount');
    console.log("ERROR HOOK sessionCount" + count);
    context.app.set("sessionCount", --count);

    try {
        if (context.app.get('sessionCount') === 0) {
            await context.params.mongoose.session.abortTransaction();
            console.log("TRANSCATION ABORTED");
        }
    } catch (localError) {
        console.log("Error faced from ABORTING transaction: " + localError);
    } finally {
        context.params.mongoose.session.endSession();
        console.log("SESSION ENDED");
    }

    return context;
}

module.exports = { beginSession, saveTranscation, cancelTranscation };