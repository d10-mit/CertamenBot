'use strict';
require('dotenv').config();

// Discord authentication (requires secret environment variables)
const Discord = require('discord.js'), discordClient = new Discord.Client();
discordClient.login(process.env.DISCORD_TOKEN).then(() => discordClient.user.setActivity('agon'));

// Google authentication (requires secret environment variables)
const { google } = require('googleapis'), googleClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
googleClient.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: googleClient }), drive = google.drive({ version: 'v3', auth: googleClient });

// Map of channel IDs to Objects that stores ALL temporary data
const channelData = new Map();

// Event triggered whenever a Message is received
discordClient.on('message', message => {
	// Check that bot doesn't act on its own messages
	if(message.author.id === discordClient.user.id) return;

	// Reacts to DMs
	if(message.channel.type === 'dm') {
		message.reply('Stop sliding into my DMs!');
	}
	// Reacts to messages in text channels
	else if(message.channel.type === 'text') {
		const chan = message.channel;
		let chanData = channels.find(ch => ch.id === chan.id);

		if(!chanData) {
			chanData = { id : chan.id, scores : [0, 0, 0], buzzList : [] };
			channels.push(chanData);
		}

		const cmd = message.content.toLowerCase(), mod = chanData.moderator;
		const author = message.author;

		// Branches based on case-insensitive command
		switch(message.content.toLowerCase()) {
		case 'trial methodERERERGSS':
			// const filter = (reaction, user) => reaction.emoji.name === '👍' && user.id === message.author.id;

			// message.awaitReactions(filter, { max: 4, time: 60000, errors: ['time'] })
			// 	.then(collected => console.log(collected.size))
			// 	.catch(collected => {
			// 		console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
			// 	});
			break;

		case 'presence checkEREORER':
			console.log(message.member.presence.clientStatus);
			break;

		case 'mod':
			if(message.member.roles.cache.has('784460081739333642') || message.guild.id !== '693511090927304764') {
				message.delete();
				chanData.moderator = message.member;
				message.reply('you are now the moderator.');
			}
			break;

		case 'keepscore':
			if(mod && mod.user === author) {
				drive.files.copy({ fileId: '1j1BH0CI_LX2B386aAUbQKWhhvEYDtZPmTB-N_2a4c4s', resource: { name: `Certamen ${new Date(message.createdTimestamp).toLocaleString()}` } }).then(file => {
					chanData.scoresheetId = file.data.id;
					drive.permissions.create({ resource: { type: 'anyone', role: 'reader' }, fileId: chanData.scoresheetId });
					sheets.spreadsheets.values.update({
						spreadsheetId: chanData.scoresheetId,
						range: '1:1',
						valueInputOption: 'Raw',
						resource: { values: [[`Server: ${message.guild.name}`, '', `Channel: ${chan.name}`, '', '', `Moderator: ${message.member.nickname}`]] },
					});
					message.reply(`here's your scoresheet: https://docs.google.com/spreadsheets/d/${chanData.scoresheetId}.`);
				});
			}
			break;

		case 'c':
			// chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
			//          ' has cleared the buzzes.\n
			if(mod && mod.user === author || author.id === '431824146897305600') {
				message.delete();
				chan.send(`**__${'\\_'.repeat(100)}__**`);
				chanData.buzzList = [];
			}
			break;

		case 'roleassignESGSBFDDG':
			message.delete();
			console.log(message.guild.roles.cache);
			// const role = message.guild.roles.cache.find(r => r.name === 'new');
			// const myRole = message.guild.me.roles.highest;
			// role.setPosition(11);
			break;

		case 'commands':
			message.delete();
			chan.send(`Salvē, ${author}! Here is a list of commands you can give me.\n` +
				'`commands`: you are here\n`guide`: links to guide\n`mod`: sets moderator\n' +
				'`c`: clears buzzes\n`buzz`: buzzes\n`r`: recognizes buzzes\n' +
				'`a753`: adds 753 points to Team A\'s score\n`b-509`: subtracts 509 points from Team B\'s score\n' +
				'`c=476`: sets Team C\'s score to 476\n`scores`: updates scores');
			break;

		case 'guide':
			message.delete();
			chan.send(`Salvē, ${author}!${guideMsg}`);
			break;

		case 'r':
			if(mod && mod.voice.channelID && mod.user === author) {
				message.delete();
				mod.voice.setMute(false);
			}
			// chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
			//          ' has recognized the buzzes.');
			break;

		case 'latency?':
			message.reply('').then(m => chan.send(`${m.createdTimestamp - message.createdTimestamp} milliseconds.`));
			break;

		case 'scores': {
			message.delete();
			const sc = chanData.scores;
			chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
				` has issued a score update.\nTeam A: ${sc[0]}\nTeam B: ${sc[1]}\nTeam C: ${sc[2]}`);
			break;
		}

		case 'quote':
			if(chan.guild.id === '711678565594300468') {
				message.delete();
				const q = quotes[Math.floor(quotes.length * Math.random())];
				chan.send(`"${q[0]}" (${q[1]}, 2020)`);
			}
			break;

		case 'channeldata':
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Some title')
				.setURL('https://discord.js.org/')
				.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
				.setDescription('Some description here')
				.setThumbnail('https://i.imgur.com/wSTFkRM.png')
				.addFields(
					{ name: 'Regular field title', value: 'Some value here' },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Inline field title', value: 'Some value here', inline: true },
					{ name: 'Inline field title', value: 'Some value here', inline: true },
				)
				.addField('Inline field title', 'Some value here', true)
				.setImage('https://i.imgur.com/wSTFkRM.png')
				.setTimestamp()
				.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
			chan.send(exampleEmbed);
			break;

		default:
			if(['buzz', '🐝', 'b', 'juzz', 'i would like to attempt to answer this question.', 'yea yea yeaaa', 'buizel', 'alert!', 'boop', 'bz', 'yippee.', 'buzzz', 'zubb', 'bb', 'dog', 'gabbagool!', 'buz', 'whammy.', 'blammo!', 'anti-pog!', 'click', 'banana!', 'hubba hubba', 'βόμβος', 'zub', 'buzzum chh'].includes(cmd)) {
				message.delete();
				if(mod && mod.voice.channelID) mod.voice.setMute(true);
				processBuzz(message, author, chan, chanData);
			}
			// 799140948458209300
			if(cmd.charAt(0) === 'p' && message.member.roles.cache.has('784460081739333642')) {
				const bbb = cmd.split(' ');
				if(bbb.length === 3 && bbb[0] === 'p') {
					const tu = parseInt(bbb[1]);
					const bonus = parseInt(bbb[2]);
					if(tu >= 0 && tu <= 20 && (bonus === 1 || bonus === 2)) {
						message.delete();
						chan.send('TU' + tu + ', B' + bonus + ': ' + boni[2 * tu + bonus - 1]);
					}
				}
			}

			if(cmd.startsWith('bsmt')) {
				message.delete();
				const m = message.content.split('  ');
				discordClient.guilds.cache.find(g => g.name === m[1]).channels.cache.find(c => c.name === m[2]).send(m[3]);
				// discordClient.guilds.cache.find(g => g.name === m[1]).channels.cache.find(c => c.id === '816464676899782696').send(m[3]);
			}
			// const teamLetter = cmd.charAt(0).toUpperCase();
				// if(['a=', 'b=', 'c='].includes(cmd.substring(0, 2))) {
			//   const points = parseFloat(cmd.substring(2));

			//   if(!isNaN(points)) {
			//     message.delete();
			//     chanData.scores[cmd.charCodeAt(0) - 97] = points;
			//     chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
			//               ` has set Team ${teamLetter}'s score to ${points}.`);
			//   }
			// }

			// else if(['A', 'B', 'C'].includes(teamLetter)) {
			//   const points = parseFloat(cmd.substring(1));

			//   if(!isNaN(points)) {
			//     message.delete();
			//     chanData.scores[cmd.charCodeAt(0) - 97] += points;

			//     if(cmd.charAt(1) === '-') {
			//       chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
			//                 ` has subtracted ${-points} points from Team ${teamLetter}'s score.`);
			//     }
			//     else {
			//       chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
			//                 ` has added ${points} points to Team ${teamLetter}'s score.`);
			//     }
			//   }
			// }
		}
	}
});

function convertStatus(activity) {
	if(activity.state) return `"${activity.state}"`;
	return `"${activity.type} ${activity.name}"`;
}

function convertPresence(presence) {
	if(!presence || presence.status === 'offline') return '**offline**';
	let s = `**${presence.status}** on ${Object.keys(presence.clientStatus).join(' and ')}`;
	if(presence.activities[0]) s += ` with status ${presence.activities.map(convertStatus).join(' and ')}`;
	return s;
}

// discordClient.on('typingStart', (channel, user) => console.log(channel.name, channel.guild.name, user.username));
discordClient.on('messageDelete', msg => msg.reply(`you think you could get away with deleting your message "${msg.content}"?`));
discordClient.on('messageUpdate', (oldMsg, newMsg) => {
	console.log('update');
	console.log(newMsg.guild.name);
	console.log(newMsg.channel.name);
	if(newMsg.content !== oldMsg.content) newMsg.reply(`you think you could get away with editing your message from "${oldMsg.content}"?`)
});

// discordClient.on('userUpdate', (oldUser, newUser) => console.log(oldUser.username, newUser.username));
// discordClient.on('presenceUpdate', (oldPres, newPres) => discordClient.users.cache.get('431824146897305600').send(`User *${newPres.user.username}* on Server *${newPres.guild.name}* changed their presence FROM ${convertPresence(oldPres)} TO ${convertPresence(newPres)}.`));

// const guideMsg = ' If you\'d like to learn about me, please refer to the following guide: ' +
//	'https://docs.google.com/document/d/1TXnkNdJlWq2y5ThYq02iM73o1AuduUnh_QhXZ3gUcj0/edit?usp=sharing.';
// add roman numeral mode
const channels = [];
let processing = false;
channels.push({ id : '690256907360796747', buzzList: new Array(5913).fill({ TS : 0 }), firstBuzzTS : 1601309000000, scores : [0, 0, 0] });
const boni = ['', ''];

// function score(q, s) {
// 	if(q === 20) {
// 		return s === 0 ? ' did not score' : ' finished with ' + s + ' points';
// 	}
// 	return s === 0 ? ' has yet to score' : ' has ' + s + ' points';
// }

function processBuzz(msg, author, chan, chanData) {
	if(processing) {
		setTimeout(processBuzz, 1, msg, author, chan, chanData);
	}
	else {
		processing = true;
		const buzzes = chanData.buzzList;
		const TS = buzzes.length ? msg.createdTimestamp - chanData.firstBuzzTS : 0;

		for(let i = 0; i < buzzes.length + 1; i++) {
			if(i === buzzes.length || TS < buzzes[i].TS) {
				let buzzPromise;

				if(i === 0) {
					buzzes.map(buzz => buzz.TS -= TS);
					chanData.firstBuzzTS = msg.createdTimestamp;
					buzzPromise = chan.send(`1. ${author} has buzzed`);
				}
				else {
					buzzPromise = chan.send(`${i + 1}. ${author} has buzzed (+${TS / 1000} s)`);
				}

				buzzPromise.then(message => {
					// message.react('✅').then(() => message.react('1️⃣')).then(() => message.react('2️⃣')).then(() => console.log(message.reactions.cache));
					buzzes.splice(i, 0, { player : author, TS : TS, buzzMsg : message });

					if(i === buzzes.length - 1) processing = false;

					for(let j = i + 1; j < buzzes.length; j++) {
						buzzes[j].buzzMsg.delete();
						const k = j;

						chan.send(`${j + 1}. ${buzzes[j].player} has buzzed (+${buzzes[j].TS / 1000} s)`)
							.then(message2 => {
								buzzes[k].buzzMsg = message2;
								processing = false;
							});
					}
				});

				break;
			}
		}
	}
}