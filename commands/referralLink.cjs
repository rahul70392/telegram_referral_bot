// commands/referralLink.cjs
module.exports = function referralLinkCommand(bot, client) {
    bot.onText(/\/referral_link/, async (msg) => {
        const userId = msg.from.id;

        try {
            // Create the referral link to the bot with the referrer ID
            const referralLink = `https://telegram.me/${process.env.BOT_USER_NAME}/?start=ref=${userId}`;
            bot.sendMessage(msg.chat.id, `Share this referral link: ${referralLink}`);
        } catch (error) {
            console.error("Error processing the /referral_link command:", error);
            bot.sendMessage(msg.chat.id, "An error occurred while processing your request.");
        }
    });
};
