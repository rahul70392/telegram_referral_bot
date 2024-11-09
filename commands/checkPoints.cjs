// commands/checkPoints.cjs
module.exports = function checkPointsCommand(bot, client) {
    bot.onText(/\/check_points/, async (msg) => {
        const userId = msg.from.id;

        try {
            const res = await client.query('SELECT points FROM Users WHERE telegram_id = $1', [userId]);
            const user = res.rows[0];

            if (user) {
                bot.sendMessage(msg.chat.id, `You have ${user.points} points.`);
            } else {
                bot.sendMessage(msg.chat.id, "You need to register first by using /start.");
            }
        } catch (error) {
            console.error("Error processing the /check_points command:", error);
            bot.sendMessage(msg.chat.id, "An error occurred while processing your request.");
        }
    });
};
