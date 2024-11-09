// commands/start.cjs

module.exports = async function startCommand(bot, client) {
    // Updated regex to capture `?ref=<referral_id>` parameter from the URL
    bot.onText(/\/start(.*)/, async (msg, match) => {
        console.log("msg",msg);
        console.log("match",match);
        const userId = msg.from.id;
        // const referrerId = match && match[1] ? parseInt(match[1], 10) : null;
        const referrerId = match && match[1] ? match[1].trim().replace('ref=', '') : null;

        console.log("User ID:", userId);  // Debugging: Check the user ID
        console.log("Captured Referrer ID:", referrerId);  // Debugging: Check the referrer ID

        try {
            // Check if the user already exists in the database
            const userRes = await client.query('SELECT * FROM Users WHERE telegram_id = $1', [userId]);
            const existingUser = userRes.rows[0];

            if (existingUser) {
                return bot.sendMessage(msg.chat.id, "Welcome back! You're already registered.");
            }

            // Register the new user with or without a referrer ID
            await client.query(`
                INSERT INTO Users (telegram_id, points, referrer_id) VALUES ($1, $2, $3)
            `, [userId, 0, referrerId]);

            // If referrerId exists, send group invite link to the new user
            if (referrerId) {
                bot.sendMessage(
                    msg.chat.id,
                    `Welcome! You've been registered successfully.\nPlease join StrikeBit official group: ${process.env.GROUP_INVITE_LINK}`
                );
            } else {
                bot.sendMessage(msg.chat.id, "Welcome! You've been registered successfully.");
            }
        } catch (error) {
            console.error("Error processing the /start command:", error);
            bot.sendMessage(msg.chat.id, "An error occurred while processing your request.");
        }
    });
};
