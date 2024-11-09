module.exports = function registerEmailCommand(bot, client) {
    bot.onText(/\/register_email/, async (msg) => {
        const userId = msg.from.id;
        
        try {
            // Prompt the user to enter their email
            bot.sendMessage(msg.chat.id, 'Please enter your email address.');

            // Listen for the user's reply
            bot.once('message', async (reply) => {
                // Check if the user replied with a valid email
                const email = reply.text;
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                // Validate email format
                if (emailRegex.test(email)) {
                    // If the email is valid, update it in the database
                    await client.query('UPDATE Users SET email = $1 WHERE telegram_id = $2', [email, userId]);
                    
                    // Send success message
                    bot.sendMessage(msg.chat.id, 'Your email has been registered successfully!');
                } else {
                    // If the email is invalid, notify the user
                    bot.sendMessage(msg.chat.id, 'Invalid email format. Please make sure the email is correct and try again.');
                }
            });
        } catch (error) {
            console.error('Error processing the /register_email command:', error);
            bot.sendMessage(msg.chat.id, 'An error occurred while processing your request.');
        }
    });
};

