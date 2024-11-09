// commands/updateEmail.cjs

module.exports = function updateEmailCommand(bot, client) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation

    bot.onText(/\/update_email/, (msg) => {
        const chatId = msg.chat.id;

        // Ask user for the new email
        bot.sendMessage(chatId, "Please enter your new email address:");

        // Set up listener for user response
        bot.once('message', async (responseMsg) => {
            const newEmail = responseMsg.text;

            // Check if the input is a valid email
            if (!emailRegex.test(newEmail)) {
                bot.sendMessage(chatId, "Invalid email address. Please try again by using /update_email.");
                return;
            }

            try {
                const userId = msg.from.id;

                // Update the email in the database
                const updateQuery = 'UPDATE Users SET email = $1 WHERE telegram_id = $2 RETURNING *';
                const values = [newEmail, userId];
                const result = await client.query(updateQuery, values);

                // If user not found in the database
                if (result.rowCount === 0) {
                    bot.sendMessage(chatId, "No existing email found. Please register your email first.");
                } else {
                    // Respond with the updated email
                    bot.sendMessage(chatId, `Your email has been successfully updated to: ${newEmail}`);
                }
            } catch (error) {
                console.error("Error updating email:", error);
                bot.sendMessage(chatId, "An error occurred while updating your email. Please try again later.");
            }
        });
    });
};
