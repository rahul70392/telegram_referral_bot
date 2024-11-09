// commands/registerEmail.cjs
module.exports = function registerEmailCommand(bot, client) {
    bot.onText(/\/register_email (.+)/, async (msg, match) => {
        const userId = msg.from.id;
        const email = match[1];

        try {
            await client.query('UPDATE Users SET email = $1 WHERE telegram_id = $2', [email, userId]);
            bot.sendMessage(msg.chat.id, "Your email has been registered successfully.");
        } catch (error) {
            console.error("Error processing the /register_email command:", error);
            bot.sendMessage(msg.chat.id, "An error occurred while processing your request.");
        }
    });
};
