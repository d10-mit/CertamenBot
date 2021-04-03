'use strict';

const token = process.env.TOKEN, Discord = require('discord.js'), client = new Discord.Client();
const guideMsg = ' If you\'d like to learn about me, please refer to the following guide: ' +
                 'https://docs.google.com/document/d/1TXnkNdJlWq2y5ThYq02iM73o1AuduUnh_QhXZ3gUcj0/edit?usp=sharing.';
//add roman numeral mode
var channels = [], processing = false;
channels.push({id : '690256907360796747', buzzList: new Array(5913).fill({TS : 0}), firstBuzzTS : 1601309000000, scores : [0, 0, 0]});
var quotes = [['Sorry, Andrew, I do not play Herbs vs. Aliens', 'Chen'],
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
var boni = ['','','Say using the best classical Latin and only subjunctive verbs: “Why should they have run when they saw nothing to fear?”',
            'Say using the best classical Latin and a relative clause: “The attack killed more soldiers than the undertakers could bury.”',
            'What Italian poet, who is often said to have ushered in the Renaissance by rediscovering Cicero’s letters, authored an epic called *Africa* that was largely modeled on the *Aeneid*?',
            'What other Italian, who borrows from Apuleius’ ***Metamorphōsēs*** for a few of the stories in his best-known work, composed a *Theseid* that contained the same number of books and lines as Vergil’s *Aeneid*?',
            'What emperor, whom Gundobad appointed to succeed Olybrius before leaving Rome, briefly ruled the West before he was overthrown by Julius Nepos in 474 A.D.?',
            'At this time, Zeno was ruling in the East. Zeno was originally a chieftain in what mountainous Turkish region, whose people later led an extended revolt against the rule of Anastasius I?',
            'Give the meaning of the deponent “**fatīscor**,” which appears in classical Latin as **fatīscō**.',
            'Give either the meaning of the deponent “**pālor**” or the deponent “**rīmor**.”',
            'Epeius also competes in the throwing-contest at the funeral games, losing to what Lapith, who also beats his own great friend Leonteus?',
            'Name Epeius’ father, an émigré to Phocis who participated in the Calydonian boar hunt and joined Amphitryon in attacking the Teleboans.',
            'Because of its famous intelligentsia, what region of Greece is joined with “**sal**” in a two-word phrase that means “keen wit”?',
            'In the early modern period, important textbooks on Latin verse composition and music theory were known by the Latin title “**Gradūs ad** [what location]” in Greece?',
            'What name, invented in modern times, is given to the poetic collection in which the ***Pervigilium Veneris*** appears?',
            'What author’s hexameter poem ***Dē Concubitū Mārtis et Veneris*** is also included in the ***Anthologia Latīna***?',
            'What Latin name is given to the calendar-based lists of magistrates and triumphs, which were known respectively as the **cōnsulārēs** and **triumphālēs**?',
            'In 304 B.C., what son of a freedman posted in the Forum a calendar of **diēs fāstī** and **diēs nefāstī**, indicating on which days business was and was not permitted?',
            'Differentiate in derivation between the noun “manger” and the suffix “-monger,” as seen in words such as “fishmonger” and “cheesemonger.” Please provide the definition for each Latin word.',
            'Differentiate in derivation between the nouns “suet” and “suit.” Please provide the definition for each Latin word.',
            'Some scholars believe that the story of the sinking of Atlantis derives from a volcanic eruption that devastated what Aegean island, which Membliarus legendarily colonized and which Battus left to found the colony of Cyrene?',
            'What autochthon, one of the first inhabitants of Atlantis, was the father of Cleito with his wife, Leucippe?',
            'In what work, where Horace claims to have invented a new literary form, does the term **plāgōsus** appear?',
            'What Republican poet addressed a biting fragment to Orbilius and likely wrote the epic ***Pragmatia Bellī Gallicī***?',
            'What Germanic tribe did Caesar defeat at the Vosges after he received appeals for help from several quarters?',
            'In 55 B.C., Caesar massacred what two Germanic tribes, whom the Suebi had originally displaced, then constructed a bridge across the Rhine in ten days?',
            'Now translate this sentence, taken from Plautus, from Latin to English: “**servāte istum sultis intus, nē forīs pedem ecferat.**”',
            'Now translate this sentence, taken from Plautus, from Latin to English: “**Tantī quantī poscit, vīn tantī illam emī?**”',
            'According to Ovid’s ***Metamorphōsēs***, what inhabitant of Mount Othrys was saved from drowning by a group of nymphs? Another source says that he was transformed into a scarab beetle, which possesses prominent horns.',
            'According to Ovid’s ***Metamorphōsēs***, what Cypriot people, who had twin horns on their foreheads, were transformed into horned bulls by Venus after engaging in persistent human sacrifice?',
            'What specific locations were watched over by the **Larēs Compitālēs**, who were fêted in the **Compitālia**?',
            'What hymn begins with a triple invocation of the “**Lasēs**”—an ancient name for the **Larēs**—calls on the **Sēmōnēs** and the god Mars, and ends with a quintuple shout of “**triumphe**”?',
            'How did a book factor into the death of Verginius Rufus?',
            'The passage continues. You will have 30 seconds for this bonus: **ille mihi tutor relictus affectum parentis exhibuit. Sic candidatum me suffragio ornavit; sic ad omnes honores meos ex secessibus accucurrit, cum iam pridem eiusmodi officiis renuntiasset; sic illo die quo sacerdotes solent nominare quos dignissimos sacerdotio iudicant, me semper nominabat.**\n\nWhat was remarkable about Verginius Rufus’ decision to support the writer when he offered himself as a candidate for office?',
            'In Caesar’s verse epigram on Terence, he praises the comedian’s linguistic immaculacy with what three-word phrase, partly related to **ēmendātor sermōnis ūsitātī**?',
            'In Book 1 of the ***Dē Rērum Nātūrā***, Lucretius uses what three-word Latin phrase, again containing the form **sermōnis**, to lament the paucity of vocabulary in Latin?',
            'Some believe Aventinus was Vergil’s invention, but others consider him a native Italian hero adapted by the author to the story. Similarly, what ancient Roman goddess, who is said to have saved the plebeians during their first secession, may have been transformed by Vergil into the sister of Dido in the *Aeneid*?',
            'Similarly, what ancient Italian cult-hero was worshipped with Egeria and Diana at Aricia before Vergil made him a character in the poem as the son of a woman named Aricia?',
            'What emperor established a similar charity for young girls in honor of his deified wife, for whom he erected a temple in the Roman Forum that bears both of their names?',
            'What is the name for a gift of oil, grain, or money to the people on special occasions like military victories, such as when Trajan gave a donative of 650 **dēnāriī** per head after the First Dacian War?',
            'What use of the dative, a subset of the dative of reference, is common with personal pronouns and is exemplified by Cicero’s phrase “**Ecce tibi Sebosus**”?',
            'What name is sometimes given to a dative that marks the entity from whose perspective a statement is true, like with both datives in Catullus’ phrase “**Quīntia fōrmōsa est multīs, mihi candida, longa, rēcta est**”?']

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
    var buzzes = chanData.buzzList;
    const TS = buzzes.length ? msg.createdTimestamp - chanData.firstBuzzTS : 0;

    for(var i = 0; i < buzzes.length + 1; i++) {
      if(i === buzzes.length || TS < buzzes[i].TS) {
        var buzzPromise;

        if(i === 0) {
          buzzes.map(buzz => buzz.TS -= TS);
          chanData.firstBuzzTS = msg.createdTimestamp;
          buzzPromise = chan.send(`1. ${author} has buzzed`);
        }
        else {
          buzzPromise = chan.send(`${i + 1}. ${author} has buzzed (+${TS / 1000} s)`);
        }

        buzzPromise.then(message => {
          buzzes.splice(i, 0, {player : author, TS : TS, buzzMsg : message});

          if(i === buzzes.length - 1) processing = false;

          for(var j = i + 1; j < buzzes.length; j++) {
            buzzes[j].buzzMsg.delete();
            var k = j;

            chan.send(`${j + 1}. ${buzzes[j].player} has buzzed (+${buzzes[j].TS / 1000} s)`)
                .then(message => {
                  buzzes[k].buzzMsg = message;
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
  const time = Date.now();
  const author = msg.author;

  if(!msg.guild && author !== client.user) {
    msg.reply(`Sorry, sliding into my DMs is not allowed (unfortunately).${guideMsg}`);
  }
  else {
    const chan = msg.channel;
    var chanData = channels.find(ch => ch.id === chan.id);

    if(!chanData) {
      chanData = {id : chan.id, scores : [0, 0, 0], buzzList : []};
      channels.push(chanData);
    }

    const cmd = msg.content.toLowerCase(), mod = chanData.moderator;
    
    switch(cmd) {
      // case 'commands':
      //   msg.delete();
      //   chan.send(`Salvē, ${author}! Here is a list of commands you can give me.\n` +
      //             '`commands`: you are here\n`guide`: links to guide\n`mod`: sets moderator\n' +
      //             '`c`: clears buzzes\n`buzz`: buzzes\n`r`: recognizes buzzes\n' +
      //             '`a753`: adds 753 points to Team A\'s score\n`b-509`: subtracts 509 points from Team B\'s score\n' +
      //             '`c=476`: sets Team C\'s score to 476\n`scores`: updates scores');
      //   break;
      
      // case 'guide':
      //   msg.delete();
      //   chan.send(`Salvē, ${author}!` + guideMsg);
      //   break;
      
      case 'am i a mod?':
        msg.reply(msg.member.roles.cache.has('784460081739333642') ? 'Yes!' : 'No!');
        break;

      case 'mod':
        if(msg.member.roles.cache.has('784460081739333642') || msg.guild.id !=='693511090927304764' ) {
          msg.delete();
          chanData.moderator = msg.member;
          msg.reply('you are now the moderator.');
        }
        break;
      
      case 'c':
        //chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
        //          ' has cleared the buzzes.\n
        if(mod && mod.user === author || author.id === '431824146897305600') {
          msg.delete();
          chan.send('**__' + '\\_'.repeat(100) + '__**');
          chanData.buzzList = [];
        }
        break;
      
      // case 'roleassign':
      //   var role = msg.guild.roles.cache.find(role => role.name === "new");
      //   var myRole = msg.guild.me.roles.highest;
      //   console.log(myRole.highestPosition);
      //   role.setPosition(11);

      //case 'buzz':
      //  msg.delete();
      //  if(mod && mod.voice.channelID)
      //    mod.voice.setMute(true);
      //  processBuzz(msg, author, chan, chanData);
      //  break;
      
      case 'r':
        if(mod && mod.voice.channelID && mod.user === author) {
          msg.delete();
          mod.voice.setMute(false);
        }
        //chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
        //          ' has recognized the buzzes.');
        break;
      
      case 'latency?':
        msg.reply().then(message => chan.send(message.createdTimestamp - msg.createdTimestamp + ' milliseconds.'));

      // case 'scores':
      //   msg.delete();
      //   const sc = chanData.scores;
      //   chan.send(`${mod && mod.user === author ? 'The moderator' : author}` +
      //             ` has issued a score update.\nTeam A: ${sc[0]}\nTeam B: ${sc[1]}\nTeam C: ${sc[2]}`);
      //   break;
      
      // case 'quote':
      //   if(chan.guild.id === '711678565594300468') {
      //     msg.delete();
      //     const q = quotes[Math.floor(quotes.length * Math.random())];
      //     chan.send('"' + q[0] + '" (' + q[1] + ', 2020)');
      //   }
      //   break;
      
      default:
        if(['buzz', '🐝', 'b', 'juzz', 'i would like to attempt to answer this question.', 'yea yea yeaaa', 'buizel', 'alert!', 'boop', 'bz', 'yippee.', 'buzzz', 'zubb', 'bb', 'dog', 'gabbagool!', 'buz', 'whammy.', 'blammo!', 'anti-pog!', 'click', 'banana!', 'hubba hubba', 'βόμβος', 'zub', 'buzzum chh'].includes(cmd)) {
          msg.delete();
          if(mod && mod.voice.channelID)
            mod.voice.setMute(true);
          processBuzz(msg, author, chan, chanData);
        }
        //799140948458209300
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

        if(author.id === '431824146897305600') {
          const bbb = cmd.split(' ');
          if(bbb.length === 4) {
            const q = parseInt(bbb[0]);
            const t1 = parseInt(bbb[1]);
            const t2 = parseInt(bbb[2]);
            const t3 = parseInt(bbb[3]);
            if(!(isNaN(q) || isNaN(t1) || isNaN(t2) || isNaN(t3))) {
              msg.delete();
              chan.send('After ' + q + ' questions, Team II (Phillips Exeter)' + score(q, t1) + ', Team FF (Hume-Fogg)' + score(q, t2) + ', and Team JJ (Shaker Heights)' + score(q, t3) + '.');
            }
          }
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