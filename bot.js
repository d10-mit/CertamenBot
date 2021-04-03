'use strict';

const token = process.env.TOKEN, Discord = require('discord.js'), client = new Discord.Client();
const guideMsg = ' If you\'d like to learn about me, please refer to the following guide: ' +
	'https://docs.google.com/document/d/1TXnkNdJlWq2y5ThYq02iM73o1AuduUnh_QhXZ3gUcj0/edit?usp=sharing.';
// add roman numeral mode
const channels = [];
let processing = false;
channels.push({ id : '690256907360796747', buzzList: new Array(5913).fill({ TS : 0 }), firstBuzzTS : 1601309000000, scores : [0, 0, 0] });
const quotes = [['Sorry, Andrew, I do not play Herbs vs. Aliens', 'Chen'],
	['The round doesn\'t matter, but keep your heads', 'Van Der Weide'],
	['Do NOT answer futuo because I\'ll get in trouble with the co-chairs', 'Nelson'],
	['The round doesn\'t matter, but I do', 'Nelson'],
	['Meme the fuck out of this', 'Nelson'],
	['Meme away, admirals', 'Nelson'],
	['Can I send memes as my answer?', 'Hadikusumo'],
	['Sounds like Minecraft noteblocks', 'Hadikusumo'],
	['David, can you make zubb an acceptable trigger for buzzing on the bot', 'Siegmund'],
	['I will buzz with watermelon', 'Hadikusumo'],
	['Guys, don\'t miss the Aurelia passage; it\'s rly rly rly rly rly important', 'Nelson'],
	['Jesus of Rhodes', 'Hadikusumo'],
	['This is basically an elaborate troll by all four parties', 'Siegmund'],
	['Just leave it at 69 69', 'Nelson'],
	['Andrew, leave the memes to the pros', 'Nelson'],
	['What if I took out DChen and put in Michael Howard?', 'Nelson'],
	['Bitch, do not challenge', 'Nelson'],
	['HOCHBERG OUT OF NOWHERE', 'Siegmund'],
	['If you\'re a Marxist, it\'s extremely informal', 'Siegmund'],
	['Livy is just diarrhea on a page', 'Siegmund'],
	['Tacitus is just diarrhea', 'Nelson'],
	['Minutillo and Minutillo, to be published in the future', 'Hadikusumo'],
	['Will, do you want me to come over to your house and make you a pizza?', 'Nelson'],
	['I\'m gonna damnatio memoriae him for that', 'Nelson'],
	['If we did anything this year, I think it would be watermelon shirts', 'Nelson'],
	['Count as in Count Chocula?', 'Nelson'],
	['Holy fuck, Geoff Revard has a BEARD????', 'Jacobson'],
	['Mount Syphilis', 'Van Der Weide'],
	['Aspen is quite funny - my kind of humor', 'Van Der Weide'],
	['My favorite part of spirit is VA rolling out a new cheer and seeing five other states suddenly adopt a suspiciously similar cheer at the next Nats', 'Nelson'],
	['Aspen\'s moderating is not a bar; it\'s the ground to walk across', 'Siegmund'],
	['Did he just want to say sex?', 'Van Der Weide'],
	['Children walkers', 'Van Der Weide'],
	['I love T-Swizzle', 'A. Orvedahl'],
	['The non-certamen people in VA are gonna fucking riot in fellowship tomorrow', 'Nelson'],
	['No, I mean, do we personally have any cows? Actually, I live between a Walmart and a cattle rancher; every now and then, I\'ll be late for work because a cow escapes and stands on the road out of my neighborhood', 'Nelson'],
	['We\'re in college, and we like to drink ... water', 'Wilusz'],
	['I\'m a real first-world anarchist', 'Siegmund'],
	['I call him Hochberg. I dropped the Mr.; is that a sufficient demotion?', 'Siegmund'],
	['Just write notecards talking about how awesome you are', 'Nelson'],
	['Would you like a hand hug?', 'Van Der Weide'],
	['The question is, is a virtual hug better than a hand hug?', 'Hadikusumo'],
	['They sweat their milk out through their stomachs', 'D. Orvedahl'],
	['Increase your blood water content', 'Chen'],
	['Easy there, Nazi, we have identities', 'Siegmund'],
	['Is Cookie his real middle name or just a nickname?', 'Chen'],
	['That was some of the filthiest filth I\'ve ever filthed', 'Siegmund'],
	['Elon Musk? What is that?', 'Hochberg'],
	['You may touch my forearm now', 'Van Der Weide'],
	['Because I peed before every round', 'Wilusz'],
	['I would have gone to the bathroom for you, JP', 'Nelson'],
	['I\'m a troglodyte; I live in caves', 'Wilusz'],
	['It\'s OK, he\'s my younger brother. I give you permission to punish him', 'A. Orvedahl'],
	['I\'M GONNA KILL YOU, SODTRODDER!', 'Donohue'],
	['Anyone else want a postgame drink ... of water?', 'Nelson'],
	['Chris! They\'re challenging! I threatened them but they did it anyway!', 'Sloan'],
	['I am not great at watching movies', 'Bombardo'],
	['My college\'s water gives me kidney stones', 'D. Orvedahl'],
	['David Chen\'s family runs around like NPCs in RuneScape', 'D. Orvedahl'],
	['We traded one manlet for a philosopher', 'Wilusz'],
	['Hochberg has called me a lot of things, but pathetic is a new one', 'Wilusz'],
	['I\'m actually enjoying this certamen', 'Nelson'],
	['We may not have been number one at national certamen, but we were number one in memes', 'Siegmund'],
	['It\'s like a beer wall but appropriate for my age', 'Donohue'],
	['I was the second highest lit player after Kyle', 'Nelson'],
	['I was the fourth highest lit player, so get on my level, Matt', 'Donohue']];
const boni = ['', ''];

function score(q, s) {
	if(q === 20) {
		return s === 0 ? ' did not score' : ' finished with ' + s + ' points';
	}
	return s === 0 ? ' has yet to score' : ' has ' + s + ' points';
}

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

client.login(token).then(() => client.user.setActivity('agon'));

client.on('message', msg => {
	const author = msg.author;

	if(!msg.guild && author !== client.user) {
		msg.reply(`Sorry, sliding into my DMs is not allowed (unfortunately).${guideMsg}`);
	}
	else {
		const chan = msg.channel;
		let chanData = channels.find(ch => ch.id === chan.id);

		if(!chanData) {
			chanData = { id : chan.id, scores : [0, 0, 0], buzzList : [] };
			channels.push(chanData);
		}

		const cmd = msg.content.toLowerCase(), mod = chanData.moderator;

		switch(cmd) {
		case 'am i a mod?':
			msg.reply(msg.member.roles.cache.has('784460081739333642') ? 'Yes!' : 'No!');
			break;

		case 'mod':
			if(msg.member.roles.cache.has('784460081739333642') || msg.guild.id !== '693511090927304764') {
				msg.delete();
				chanData.moderator = msg.member;
				msg.reply('you are now the moderator.');
			}
			break;

		case 'c':
			// chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
			//          ' has cleared the buzzes.\n
			if(mod && mod.user === author || author.id === '431824146897305600') {
				msg.delete();
				chan.send('**__' + '\\_'.repeat(100) + '__**');
				chanData.buzzList = [];
			}
			break;

		case 'roleassign': {
			msg.delete();
			console.log(msg.guild.roles.cache)
			const role = msg.guild.roles.cache.find(r => r.name === 'new');
			const myRole = msg.guild.me.roles.highest;
			// role.setPosition(11);
			break;
		}
		case 'buzz':
			msg.delete();
			if(mod && mod.voice.channelID) {
				mod.voice.setMute(true);
			}
			processBuzz(msg, author, chan, chanData);
			break;
		case 'commands':
			msg.delete();
			chan.send(`Salvē, ${author}! Here is a list of commands you can give me.\n` +
				'`commands`: you are here\n`guide`: links to guide\n`mod`: sets moderator\n' +
				'`c`: clears buzzes\n`buzz`: buzzes\n`r`: recognizes buzzes\n' +
				'`a753`: adds 753 points to Team A\'s score\n`b-509`: subtracts 509 points from Team B\'s score\n' +
				'`c=476`: sets Team C\'s score to 476\n`scores`: updates scores');
			break;

		case 'guide':
			msg.delete();
			console.log(client.users.cache);
			chan.send(`Salvē, ${author}!` + guideMsg);
			break;

		case 'r':
			if(mod && mod.voice.channelID && mod.user === author) {
				msg.delete();
				mod.voice.setMute(false);
			}
			// chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
			//          ' has recognized the buzzes.');
			break;

		case 'latency?':
			msg.reply().then(message => chan.send(message.createdTimestamp - msg.createdTimestamp + ' milliseconds.'));
			break;
		case 'scores': {
			msg.delete();
			const sc = chanData.scores;
			chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
				` has issued a score update.\nTeam A: ${sc[0]}\nTeam B: ${sc[1]}\nTeam C: ${sc[2]}`);
			break;
		}

		case 'quote':
			if(chan.guild.id === '711678565594300468') {
				msg.delete();
				const q = quotes[Math.floor(quotes.length * Math.random())];
				chan.send('"' + q[0] + '" (' + q[1] + ', 2020)');
			}
			break;

		default:
			if(['buzz', '🐝', 'b', 'juzz', 'i would like to attempt to answer this question.', 'yea yea yeaaa', 'buizel', 'alert!', 'boop', 'bz', 'yippee.', 'buzzz', 'zubb', 'bb', 'dog', 'gabbagool!', 'buz', 'whammy.', 'blammo!', 'anti-pog!', 'click', 'banana!', 'hubba hubba', 'βόμβος', 'zub', 'buzzum chh'].includes(cmd)) {
				msg.delete();
				if(mod && mod.voice.channelID) {
					mod.voice.setMute(true);
				}
				processBuzz(msg, author, chan, chanData);
			}
			// 799140948458209300
			if(cmd.charAt(0) === 'p' && msg.member.roles.cache.has('784460081739333642')) {
				const bbb = cmd.split(' ');
				if(bbb.length === 3 && bbb[0] === 'p') {
					const tu = parseInt(bbb[1]);
					const bonus = parseInt(bbb[2]);
					if(tu >= 0 && tu <= 20 && (bonus === 1 || bonus === 2)) {
						msg.delete();
						chan.send('TU' + tu + ', B' + bonus + ': ' + boni[2 * tu + bonus - 1]);
					}
				}
			}

			if(cmd.startsWith('dayway')) {
				let m = msg.content.split();
				console.log(m);
				msg.delete();
				console.log(client.guilds.cache.find(g => g.name === m[1]))''
				client.guilds.cache.find(g => g.name === m[1]).channels.cache.find(c => c.name === m[2]).send(m[3]);
			}
			// const teamLetter = cmd.charAt(0).toUpperCase();
				// if(['a=', 'b=', 'c='].includes(cmd.substring(0, 2))) {
			//   const points = parseFloat(cmd.substring(2));

			//   if(!isNaN(points)) {
			//     msg.delete();
			//     chanData.scores[cmd.charCodeAt(0) - 97] = points;
			//     chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
			//               ` has set Team ${teamLetter}'s score to ${points}.`);
			//   }
			// }

			// else if(['A', 'B', 'C'].includes(teamLetter)) {
			//   const points = parseFloat(cmd.substring(1));

			//   if(!isNaN(points)) {
			//     msg.delete();
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