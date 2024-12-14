module.exports.config = {
	name: "unsend",
	aliases: ["uns", "u"],
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "Gỡ tin nhắn của bot",
	commandCategory: "system",
	usages: "unsend",
	cooldowns: 0
};

module.exports.languages = {
	"vi": {
		"returnCant": "Không thể gỡ tin nhắn của người khác.",
		"missingReply": "Hãy reply tin nhắn cần gỡ."
	},
	"en": {
		"returnCant": "Cannot unsend other users' messages.",
		"missingReply": "Please reply to the bot's message you want to unsend."
	}
};

module.exports.onStart = async function ({ message, event, api, getLang }) {
	// Check if the message is a reply and if the bot sent the original message
	if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID()) {
		return message.reply(getLang("missingReply"));  // Return an error message if not
	}
	// Proceed to unsend the bot's message
	try {
		await api.unsendMessage(event.messageReply.messageID);
	} catch (error) {
		message.reply(getLang("returnCant"));  // Error handling
	}
};
