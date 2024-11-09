// commands/updateEmail.cjs
module.exports = function updateEmailCommand(bot, client) {
    bot.onText(/\/update_email (.+)/, async (msg, match) => {
        const userId = msg.from.id;
        const newEmail = match[1];

        try {
            const res = await client.query('SELECT * FROM Users WHERE telegram_id = $1', [userId]);
            const user = res.rows[0];

            if (!user) {
                return bot.sendMessage(msg.chat.id, "You need to register your email first using /register_email.");
            }

            await client.query('UPDATE Users SET email = $1 WHERE telegram_id = $2', [newEmail, userId]);
            bot.sendMessage(msg.chat.id, "Your email has been updated successfully.");
        } catch (error) {
            console.error("Error processing the /update_email command:", error);
            bot.sendMessage(msg.chat.id, "An error occurred while processing your request.");
        }
    });
};
