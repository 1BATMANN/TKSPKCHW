const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client({
  readyStatus: false,
  checkUpdate: false
});

client.on('ready', async () => {
    console.clear();
    console.log(`rich presence started !`
               )
const r = new Discord.RichPresence()
    .setApplicationId('1020573995562700844')
    .setType('PLAYING')
    .setURL('https://www.youtube.com/')
    .setState('┗━━━━━━━━━━⊱ ⊰━━━━━━━━━━┛')

    .setName('ㅤㅤㅤ𝕿𝖍𝖊 𝕸𝖆𝖓 𝖔𝖋 𝕲𝖗𝖊𝖊𝖉 !')
    .setDetails('𝙔𝙊𝙐 𝘾𝘼𝙉 𝙏𝙀𝙇𝙇 𝙅𝙐𝙎𝙏 𝘽𝙔 𝙇𝙊𝙊𝙆𝙄𝙉𝙂!')
    .setAssetsLargeImage('https://cdn.discordapp.com/attachments/962264704573665280/1236185628052557845/skull.gif?ex=66371714&is=6635c594&hm=ee89d1ee52cf6e948234072b1848de051d114f22a06fab40291b92190ff692ff&') 
    .setAssetsLargeText('SCULL')
    .setAssetsSmallImage('https://cdn.discordapp.com/attachments/962264704573665280/1236182806707699763/test-again-doesnt-work.gif?ex=66371474&is=6635c2f4&hm=72b05fb76f0bf86c5bf50ed85228b981ed56d541e015e994e45ec77e41d66fd3&')
    .setAssetsSmallText('LOADING..!')
     client.user.setActivity(r);
     client.user.setPresence({ status: "dnd" });
})

client.login(process.env.chawcha3)