import Log from "../models/Log.js";

export const findOrCreateLog = async (userId)=> {
    try {
        // set the date to query database
        const date = new Date();
        date.setHours(date.getHours() - 5);
        date.setHours(0, 0, 0, 0);
        console.log('findOrCreateLog date:', date);

        // check for the log and if it doesnt exist, make one
        let dailyLog = await Log.findOne({ userId, date });
        if (!dailyLog) {
            dailyLog = new Log({ userId, date });
            await dailyLog.save();
            console.log('New daily log created:', dailyLog);
        } else {
            console.log('Existing daily log found:', dailyLog);
        }
        

        return dailyLog;
    } catch (error) {
        console.error('Error in findOrCreateDailyLog:', error);
    }
} 