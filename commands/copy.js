const { SlashCommandBuilder, ApplicationCommandPermissionType } = require('discord.js');
const { EmbedBuilder, WebhookClient } = require('discord.js');

function getUserData(user) {
	return {
		"username": user.username,
		"avatar": "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".jpeg",
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sendas')
		.setDescription('Send a message as another user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('User ID')
				.setRequired(true)
			)
		.addStringOption(option =>
			option.setName('content')
				.setDescription('Content')
				.setRequired(true)
			),
	
	async execute(interaction) {
		var data = getUserData(interaction.options.getUser("user"));
		interaction.guild.members.cache.forEach(x=>{
			if (x.user.id == interaction.options.getUser("user").id) {
				if (x.avatar) data.avatar = "https://cdn.discordapp.com/avatars/" + x.user.id + "/" + x.user.avatar + ".jpeg";
				if (x.nickname) data.username = x.nickname;
			}
		});
		const webhooks = await interaction.channel.fetchWebhooks();
		var wh = webhooks.find(wh => wh.token);
		if (!wh) {
			wh = await interaction.channel.createWebhook({
				name: data.username,
				avatar: data.avatar,
			})
		}
		wh.send({
			content: interaction.options.getString("content") ?? "Hello",
			username: data.username,
			avatarURL: data.avatar,
		});
		await interaction.reply({
			content: 'Sending Message...',
			ephemeral: true
		})
	},
};
