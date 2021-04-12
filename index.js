'use strict';
require('dotenv').config();

// Creates vanilla website from HTML file
const website = require('express')();
website.listen(process.env.PORT || 3000); // website.listen(process.env.PORT ?? 3000);
website.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));

// Map of Channel IDs to Objects that stores ALL temporary data
const channelData = new Map();

// Discord authentication (requires secret environment variables)
const Discord = require('discord.js'), discordClient = new Discord.Client();
discordClient.login(process.env.DISCORD_TOKEN).then(() => discordClient.user.setActivity('agon'));

// Google authentication (requires secret environment variables)
const { google } = require('googleapis'), googleClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
googleClient.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: googleClient }), drive = google.drive({ version: 'v3', auth: googleClient });

// Event triggered whenever a Message is received
discordClient.on('message', message => {
	// Check that bot doesn't act on its own Message
	if(message.author.id === discordClient.user.id) return;

	// Responds to messages in TextChannels
	if(message.channel.type === 'text') {
		// Initializes Channel data in the Map for every text channel
		discordClient.channels.cache.filter((channel, channelID) => channel.type === 'text' && !channelData.has(channelID)).each((textChannel, textChannelID) => {
			channelData.set(textChannelID, { buzzwords: new Set(['b', 'buzz']), settings: '1111', buzzList: [], buzzEmbedEdited : true, buzzTeams: new Set() });
			if(textChannel.viewable && textChannel.permissionsFor(textChannel.guild.me).has('SEND_MESSAGES')) textChannel.startTyping();
		});

		const channelDatum = channelData.get(message.channel.id);

		// Branches based on case-insensitive command
		switch(message.content.toLowerCase()) {
		// Sends MessageEmbed with list of commands
		case 'commands': // buzzwords can't have new line// specify buzzwords case insens
			message.delete();
			message.reply(new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setTitle('CertamenBot 2.0.0 Commands')
				.setURL('https://certamenbot.herokuapp.com')
				.setAuthor('Github', null, 'https://github.com/d10-mit/CertamenBot')
				.setDescription('All commands are case-insensitive.')
				.addField('commands', 'you are here')
				.addField('`mod`', 'sets mod')
				.setTimestamp()
				.setFooter('Copyright © 2021 David Chen'));
			break;

		// Sends MessageEmbed with bot Channel settings
		case 'settings':
			message.delete();
			message.reply(new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`Settings for channel \`${message.channel.name}\` on server \`${message.guild}\``)
				.setTimestamp()
				.setFooter('Copyright © 2021 David Chen')
				.addField('Moderator', channelDatum.moderator || '`none`') // channelDatum.moderator ?? '`none`'
				.addField('Scoresheet', channelDatum.scoresheetID ? `https://docs.google.com/spreadsheets/d/${channelDatum.scoresheetID}` : '`none`')
				.addField('Buzzwords', channelDatum.buzzwords.size ? Array.from(channelDatum.buzzwords) : '`none`')
				.addFields(require('./settings.json').map((setting, index) => ({ name: setting.name, value: `${channelDatum.settings[index]}: ${setting.parameters[channelDatum.settings[index]]}` }))));
			break;

		// Sends MessageEmbed with bot setting descriptions
		case 'settings help':
			message.delete();
			message.reply(new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setTitle('CertamenBot 2.0.0 channel setting descriptions')
				.setDescription('Default settings: 1111 (`scrim`)\nExample commands: `set 1010`, `set* tourney`')
				.setTimestamp()
				.setFooter('Copyright © 2021 David Chen')
				.addFields(require('./settings.json').map(setting => ({ name: setting.name, value: `0: ${setting.parameters[0]}\n1: ${setting.parameters[1]}` })))
				.addField('Named settings', '`scrim`: 1111\n`tourney`: 1000'));
			break;

		// Resets Channel's buzzword Set
		case 'reset':
			message.delete();
			channelDatum.buzzwords = new Set(['b', 'buzz']);
			message.reply(`you have reset the buzzwords for channel ${message.channel}.`);
			break;

		// Resets buzzword Set of each TextChannel in the Guild
		case 'reset*':
			message.delete();
			message.guild.channels.cache.filter(guildChannel => guildChannel.type === 'text').each((_, guildChannelID) => channelData.get(guildChannelID).buzzwords = new Set(['b', 'buzz']));
			message.reply(`you have reset the buzzwords for server \`${message.guild}\`.`);
			break;

		// Sets Channel's moderator as the GuildMember who sent the Message
		case 'mod':
			message.delete();
			channelDatum.moderator = message.member;
			message.reply('you are now the moderator.');
			break;

		// Sets Channel's buzz list to an empty array and sends buzz-clearing line
		case 'c':
			if(channelDatum.settings[1] === '0' && !(channelDatum.moderator && channelDatum.moderator.id === message.author.id)) return; // if(channelDatum.moderator?.id !== message.author.id && channelDatum.settings[1] === '0') return;
			message.delete();
			channelDatum.buzzList = [], channelDatum.buzzEmbedMessage = null, channelDatum.buzzEmbedEdited = true, channelDatum.buzzTeams = new Set();
			if(channelDatum.moderator && channelDatum.moderator.id === message.author.id) message.channel.send(`**__${'\\_'.repeat(100)}__**`); // channelDatum.moderator?.id !== message.author.id
			else message.reply(`**__${'\\_'.repeat(100)}__**`);
			break;

		// Server unmutes moderator
		case 'r':
			if(!(channelDatum.moderator && channelDatum.moderator.voice.channelID && channelDatum.moderator.voice.serverMute)) return; // if(!(channelDatum.moderator?.voice.channelID && channelDatum.moderator?.voice.serverMute)) return;
			if(channelDatum.settings[0] === '0' || channelDatum.settings[1] === '0' && channelDatum.moderator.id !== message.author.id) return;
			message.delete();
			channelDatum.moderator.voice.setMute(false);
			if(channelDatum.moderator.id !== message.author.id) message.channel.send(`${message.author} has recognized the buzzes.`);
			break;

		// Sends Aurelia passage
		case 'aurelia':
			message.delete();
			message.reply(`here's the Aurelia passage: ${require('./aurelia.json')}`);
			break;

		// Creates, shares, and sends scoresheet
		case 'keep score':
			if(!(channelDatum.moderator && channelDatum.moderator.id === message.author.id)) return; // if(channelDatum.moderator?.id !== message.author.id)
			message.delete();
			drive.files.copy({ fileId: '1j1BH0CI_LX2B386aAUbQKWhhvEYDtZPmTB-N_2a4c4s', resource: { name: `Certamen ${message.createdAt.toLocaleString('en-CA')}` } }).then(file => {
				channelDatum.scoresheetID = file.data.id;
				drive.permissions.create({ resource: { type: 'anyone', role: 'reader' }, fileId: channelDatum.scoresheetID });
				sheets.spreadsheets.values.update({
					spreadsheetId: channelDatum.scoresheetID,
					range: '1:1',
					valueInputOption: 'Raw',
					resource: { values: [[`Server: ${message.guild}`, '', `Channel: ${message.channel.name}`, '', '', `Moderator: ${message.member.nickname || message.author.username}`]] }, // replace w ??
				});
				message.reply(`here's your scoresheet: https://docs.google.com/spreadsheets/d/${channelDatum.scoresheetID}.`);
			});
			break;

		// Replies to original message and edits reply to add time difference between original message and reply
		case 'latency':
			if(channelDatum.settings[3] === '0') return;
			message.delete();
			message.reply('your latency is').then(reply => reply.edit(`${message.author}, your latency is ${reply.createdAt - message.createdAt} milliseconds.`));
			break;

		// Sends MessageEmbed with Guild info
		case 'info':
			if(channelDatum.settings[3] === '0') return;
			message.delete();
			message.reply(new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`Info for server \`${message.guild}\``)
				.setURL(message.guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
				.addField('Owner', message.guild.owner, true)
				.addField('Number of members', message.guild.memberCount, true)
				.addField('Member limit', message.guild.maximumMembers, true)
				.addField('Locale', message.guild.preferredLocale, true)
				.addField('Region', message.guild.region, true)
				.addField('Default message notifs', message.guild.defaultMessageNotifications)
				.addField('Verification level', message.guild.verificationLevel, true)
				.addField('Explicit content filter', message.guild.explicitContentFilter, true)
				.addField('2FA level', message.guild.mfaLevel, true)
				.addField('Private channels (up to 20)', message.guild.channels.cache.filter(channel => !channel.viewable).map(privateChannel =>
					`${privateChannel}: ${privateChannel.permissionOverwrites.filter(permissionOverwrite => permissionOverwrite.id !== message.guild.roles.everyone.id).map(nonEveryoneOverwrite =>
						message.guild.roles.cache.get(nonEveryoneOverwrite.id) || message.guild.members.cache.get(nonEveryoneOverwrite.id)).join(', ') || '`none`'}`).join('\n') || '`none`')
				.addField('Server created', message.guild.createdAt.toLocaleString(), true)
				.addField('Channel created', message.channel.createdAt.toLocaleString(), true)
				.setTimestamp()
				.setFooter('Copyright © 2021 David Chen'));
			break;

		// Sends random quote from JSON database (requires secret VSCL password)
		case `quote ${process.env.VSCL_PASSWORD}`: {
			if(channelDatum.settings[3] === '0') return;
			message.delete();
			const quoteDatabase = require('./quotes.json'), randomQuote = quoteDatabase[Math.floor(quoteDatabase.length * Math.random())];
			message.reply(`here's your quote: "${randomQuote.quote}" (${randomQuote.author}, ${randomQuote.year}).`);
			break;
		}

		default:
			if(channelDatum.buzzwords.has(message.content.toLowerCase())) {
				const processBuzz = () => {
					if(channelDatum.buzzEmbedEdited) {
						if(channelDatum.buzzEmbedMessage) channelDatum.buzzEmbedMessage.edit(buzzEmbed).then((buzzEmbedMessage) => {
							channelDatum.buzzEmbedMessage = buzzEmbedMessage;
							channelDatum.buzzEmbedEdited = true;
						});
						else message.channel.send(buzzEmbed).then((buzzEmbedMessage) => {
							channelDatum.buzzEmbedMessage = buzzEmbedMessage;
							channelDatum.buzzEmbedEdited = true;
						});
					}
					else {
						setTimeout(processBuzz, 1)
					}
					// if(channelDatum.buzzEmbedsSent && channelDatum.buzzEmbedsDeleted) {
					// 	channelDatum.buzzEmbedsSent = false, channelDatum.buzzEmbedsDeleted = false;
					// 	message.channel.send(new Discord.MessageEmbed()
					// 		.setColor('RANDOM')
					// 		.setTitle('Buzz list')
					// 		.addFields(channelDatum.buzzList.map((buzz, index) => ({ name: '​', value: `${index + 1}. ${buzz.player} has buzzed${index ? ` (+${(buzz.buzzTime - channelDatum.buzzList[0].buzzTime) / 1000} s)` : ''}` })))
					// 		.setTimestamp()
					// 		.setFooter('Copyright © 2021 David Chen')).then(buzzEmbedMessage => {
					// 		channelDatum.buzzEmbedMessage = buzzEmbedMessage, channelDatum.buzzEmbedsSent = true;
					// 	});
					// 	if(channelDatum.buzzEmbedMessage) channelDatum.buzzEmbedMessage.delete().then(() => channelDatum.buzzEmbedsDeleted = true);
					// 	else channelDatum.buzzEmbedsDeleted = true;
					// }
					// else {
					// 	setTimeout(processBuzz, 1);
					// }
				};

				message.delete();
				if(channelDatum.settings[0] === '1' && channelDatum.moderator && channelDatum.moderator.voice.channelID) channelDatum.moderator.voice.setMute(true); // channelDatum.moderator?.voice.channelID
				const buzzPlayerNickname = message.member.nickname || message.author.username, buzzPlayerTeam = buzzPlayerNickname.substring(buzzPlayerNickname.indexOf('[') + 1, buzzPlayerNickname.indexOf(']')); // replace with ??
				channelDatum.buzzList.push({ player: message.author, buzzTime : message.createdAt, irrelevant: buzzPlayerTeam && channelDatum.buzzTeams.has(buzzPlayerTeam) });
				channelDatum.buzzTeams.add(buzzPlayerTeam);
				channelDatum.buzzList.sort((buzz1, buzz2) => buzz1.buzzTime - buzz2.buzzTime);
				const buzzEmbed = new Discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('Buzz list')
					.addFields(channelDatum.buzzList.map((buzz, index) => ({ name: '​', value: `${buzz.irrelevant ? '~~' : ''}${index + 1}. ${buzz.player} has buzzed${index ? ` (+${(buzz.buzzTime - channelDatum.buzzList[0].buzzTime) / 1000} s)` : ''}${buzz.irrelevant ? '~~' : ''}` })))
					.setTimestamp()
					.setFooter('Copyright © 2021 David Chen');
				processBuzz();
				// message.react('✅').then(() => message.react('1️⃣')).then(() => message.react('2️⃣')).then(() => console.log(message.reactions.cache));
			}

			// Adds specified buzzwords to Channel's buzzword Set
			else if(message.content.toLowerCase().startsWith('add\n')) {
				message.delete();
				const buzzWordsAdded = message.content.substring(4).toLowerCase();
				for(const buzzword of buzzWordsAdded.split('\n')) channelDatum.buzzwords.add(buzzword);
				message.reply(`you have added the following buzzwords to channel ${message.channel}:\n${buzzWordsAdded}`);
			}

			// Adds specified buzzwords to buzzword Set of each TextChannel in the Guild
			else if(message.content.toLowerCase().startsWith('add*\n')) {
				message.delete();
				const buzzWordsAdded = message.content.substring(5).toLowerCase();
				message.guild.channels.cache.filter(guildChannel => guildChannel.type === 'text').each((_, guildChannelID) => {
					for(const buzzword of buzzWordsAdded.split('\n')) channelData.get(guildChannelID).buzzwords.add(buzzword);
				});
				message.reply(`you have added the following buzzwords to server \`${message.guild}\`:\n${buzzWordsAdded}`);
			}

			// Deletes specified buzzwords from Channel's buzzword Set
			else if(message.content.toLowerCase().startsWith('remove\n')) {
				message.delete();
				const buzzWordsRemoved = message.content.substring(7).toLowerCase();
				for(const buzzword of buzzWordsRemoved.split('\n')) channelDatum.buzzwords.delete(buzzword);
				message.reply(`you have removed the following buzzwords from channel ${message.channel}:\n${buzzWordsRemoved}`);
			}

			// Deletes specified buzzwords from buzzword Set of each TextChannel in the Guild
			else if(message.content.toLowerCase().startsWith('remove*\n')) {
				message.delete();
				const buzzWordsRemoved = message.content.substring(8).toLowerCase();
				message.guild.channels.cache.filter(guildChannel => guildChannel.type === 'text').each((_, guildChannelID) => {
					for(const buzzword of buzzWordsRemoved.split('\n')) channelData.get(guildChannelID).buzzwords.delete(buzzword);
				});
				message.reply(`you have removed the following buzzwords from server \`${message.guild}\`:\n${buzzWordsRemoved}`);
			}

			// Sets Channel settings to a specified string
			else if(message.content.toLowerCase().startsWith('set ')) {
				let settingsInput = message.content.substring(4).toLowerCase();
				if(settingsInput === 'scrim') settingsInput = '1111';
				else if(settingsInput === 'tourney') settingsInput = '1000';
				if(!(settingsInput.length === 4 && settingsInput.split('').every(setting => setting === '0' || setting === '1'))) return;
				message.delete();
				channelDatum.settings = settingsInput;
				message.reply(`you have set the settings for channel ${message.channel} to \`${message.content.substring(4)}\`.`);
			}

			// Sets Channel settings to a specified string for each TextChannel in the Guild
			else if(message.content.toLowerCase().startsWith('set* ')) {
				let settingsInput = message.content.substring(5).toLowerCase();
				if(settingsInput === 'scrim') settingsInput = '1111';
				else if(settingsInput === 'tourney') settingsInput = '1000';
				if(!(settingsInput.length === 4 && settingsInput.split('').every(setting => setting === '0' || setting === '1'))) return;
				message.delete();
				message.guild.channels.cache.filter(guildChannel => guildChannel.type === 'text').each((_, guildChannelID) => channelData.get(guildChannelID).settings = settingsInput);
				message.reply(`you have set the settings for server \`${message.guild}\` to \`${message.content.substring(5)}\`.`);
			}

			// Sends devices on which mentioned User is online
			else if(message.content.toLowerCase().startsWith('devices ') && message.mentions && message.content.length === 30 && channelDatum.settings[3] === '1') {
				message.delete();
				const mentionedUser = message.mentions.users.first(), mentionedUserDevices = mentionedUser.presence.clientStatus;
				if(mentionedUserDevices && Object.keys(mentionedUserDevices).length) message.reply(`${mentionedUser} is on ${Object.keys(mentionedUserDevices).join(' and ')}.`);
				else message.reply(`${mentionedUser} is currently not on any devices.`);
			}

			// Sends link to full-resolution image of mentioned User's avatar
			else if(message.content.toLowerCase().startsWith('avatar ') && message.mentions && message.content.length === 29 && channelDatum.settings[3] === '1') {
				message.delete();
				const mentionedUser = message.mentions.users.first();
				message.reply(`${mentionedUser}'s avatar link is ${mentionedUser.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })}.`);
			}

			// Sets mentioned User's nickname to a specified string or declares the inability to do so
			else if(message.content.toLowerCase().startsWith('nick <@!') && message.content.indexOf('> ') === 26 && channelDatum.settings[3] === '1') {
				const mentionedMembers = message.mentions.members;
				if(mentionedMembers.size !== 1) return;
				message.delete();
				const botMember = message.guild.me, mentionedMember = mentionedMembers.first(), newNickname = message.content.substring(28);
				if(!botMember.hasPermission('MANAGE_NICKNAMES')) {
					message.reply(`I am unable to set ${mentionedMember}'s nickname to \`${newNickname}\` because I lack \`Manage Nicknames\` permissions.`);
				}
				else if(botMember.roles.highest.comparePositionTo(mentionedMember.roles.highest) < 0) {
					message.reply(`I am unable to set ${mentionedMember}'s nickname to \`${newNickname}\` because I have a lower role.`);
				}
				else {
					message.reply(`I have set \`${mentionedMember.nickname || mentionedMember.user.username}\`'s nickname to ${mentionedMember}.`); // mentionedMember.nickname ?? mentionedMember.user.username
					mentionedMember.setNickname(newNickname);
				}
			}
		}
	}
	// Responds to DMs
	else if(message.channel.type === 'dm') {
		message.channel.startTyping();

		// Private commands: Read my code to figure out what they do
		if(message.author.id === '431824146897305600') {
			if(message.content === 'servers') {
				discordClient.guilds.cache.each(guild => message.reply(new Discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle(`Info for server \`${guild}\``)
					.setURL(guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
					.addField('Owner', guild.owner, true)
					.addField('Number of members', guild.memberCount, true)
					.addField('Member limit', guild.maximumMembers, true)
					.addField('Locale', guild.preferredLocale, true)
					.addField('Region', guild.region, true)
					.addField('Default message notifs', guild.defaultMessageNotifications)
					.addField('Verification level', guild.verificationLevel, true)
					.addField('Explicit content filter', guild.explicitContentFilter, true)
					.addField('2FA level', guild.mfaLevel, true)
					.addField('Private channels', guild.channels.cache.filter(channel => !channel.viewable).map(privateChannel =>
						`\`${privateChannel.name}\`: ${privateChannel.permissionOverwrites.filter(permissionOverwrite => permissionOverwrite.id !== guild.roles.everyone.id).map(nonEveryoneOverwrite =>
							guild.members.cache.get(nonEveryoneOverwrite.id) || `\`${guild.roles.cache.get(nonEveryoneOverwrite.id).name}\``).join(', ') || '`none`'}`).slice(0, 20).join('\n').substring(0, 1024) || '`none`')
					.addField('Server created', guild.createdAt.toLocaleString())
					.setTimestamp()
					.setFooter('Copyright © 2021 David Chen')));
			}
			else if(message.content.startsWith('send\n')) {
				const input = message.content.split('\n');
				if(input.length !== 4) return;
				const inputChannel = discordClient.guilds.cache.find(guild => guild.name === input[1]).channels.cache.find(channel => channel.name === input[2]); // const inputChannel = discordClient.guilds.cache.find(guild => guild.name === input[1])?.channels.cache.find(channel => channel.name === input[2]);
				if(!inputChannel) return;
				inputChannel.send(input[3]);
			}
		}
		else {
			message.reply('Stop sliding into my DMs!');
		}
	}
});

// function convertStatus(activity) {
// 	if(activity.state) return `"${activity.state}"`;
// 	return `"${activity.type} ${activity.name}"`;
// }

// function convertPresence(presence) {
// 	if(!presence || presence.status === 'offline') return '**offline**';
// 	let s = `**${presence.status}** on ${Object.keys(presence.clientStatus).join(' and ')}`;
// 	if(presence.activities[0]) s += ` with status ${presence.activities.map(convertStatus).join(' and ')}`;
// 	return s;
// }

// discordClient.on('typingStart', (channel, user) => console.log(channel.name, channel.guild.name, user.username));
// discordClient.on('messageDelete', msg => msg.reply(`you think you could get away with deleting your message "${msg.content}"?`));
// discordClient.on('messageUpdate', (oldMsg, newMsg) => {
// 	console.log('update');
// 	console.log(newMsg.guild.name);
// 	console.log(newMsg.channel.name);
// 	// if(newMsg.content !== oldMsg.content) newMsg.reply(`you think you could get away with editing your message from "${oldMsg.content}"?`)
// });

// discordClient.on('userUpdate', (oldUser, newUser) => console.log(oldUser.username, newUser.username));
// discordClient.on('presenceUpdate', (oldPres, newPres) => discordClient.users.cache.get('431824146897305600').send(`User *${newPres.user.username}* on Server *${newPres.guild.name}* changed their presence FROM ${convertPresence(oldPres)} TO ${convertPresence(newPres)}.`));

// function score(q, s) {
// 	if(q === 20) {
// 		return s === 0 ? ' did not score' : ' finished with ' + s + ' points';
// 	}
// 	return s === 0 ? ' has yet to score' : ' has ' + s + ' points';
// }