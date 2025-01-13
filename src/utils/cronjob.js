const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/ConnectionRequest");

cron.schedule("* 8 * * *", async () => {
    const yesterday = subDays(new Date() - 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    try {
        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");
        const listOfEmailIds = [...(new Set(pendingRequests.map((req) => req.emailId)))];

        for (const emailId of listOfEmailIds) {
            // try {
            //     const res = await sendEmail.run(
            //         "New Friend Requests pending for " + email,
            //         "There are so many friend requests pending, please login and accept or reject the requests."
            //     );
            //     console.log(res);
            // } catch (err) {
            //     console.log(err);
            // }
        }
    }
    catch (err) {
        console.error("Error " + err);
    }

});