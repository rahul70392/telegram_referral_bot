// bot.cjs
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const client = require('./database.cjs'); // Import database connection

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

(async () => {
    try {
        // Register commands with Telegram API
        const commands = [
            { command: 'start', description: 'Start interacting with the bot' },
            { command: 'register_email', description: 'Register your email address' },
            { command: 'update_email', description: 'Update your registered email' },
            { command: 'check_points', description: 'Check your reward points' },
            { command: 'referral_link', description: 'Generate a referral link' },
        ];
        await bot.setMyCommands(commands);
        console.log('Commands registered successfully.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();

// Command Handlers
require('./commands/start.cjs')(bot, client);
require('./commands/registerEmail.cjs')(bot, client);
require('./commands/updateEmail.cjs')(bot, client);
require('./commands/checkPoints.cjs')(bot, client);
require('./commands/referralLink.cjs')(bot, client);

// bot.cjs

bot.on('message', async (msg) => {
    if (msg.new_chat_members) {
        for (const newUser of msg.new_chat_members) {
            const newUserId = newUser.id;

            try {
                // Check if the new user has a referrer ID
                const userRes = await client.query('SELECT referrer_id FROM Users WHERE telegram_id = $1', [newUserId]);
                const user = userRes.rows[0];

                if (user && user.referrer_id) {
                    const referrerId = user.referrer_id;

                    // Award referral bonus points to the referrer
                    await client.query(`
                        UPDATE Users SET points = points + $1 WHERE telegram_id = $2
                    `, [parseInt(process.env.REFERRAL_BONUS, 10), referrerId]);

                    // Insert the referral record
                    await client.query(`
                        INSERT INTO Referrals (referrer_id, referred_user_id) VALUES ($1, $2)
                    `, [referrerId, newUserId]);

                    // Notify the referrer about the earned points
                    bot.sendMessage(
                        referrerId,
                        `🎉 You've earned ${process.env.REFERRAL_BONUS} points! A new user joined the group using your referral link.`
                    );
                }
            } catch (error) {
                console.error("Error processing new chat member event:", error);
            }
        }
    }
});

