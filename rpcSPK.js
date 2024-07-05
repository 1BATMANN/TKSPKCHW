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
    .setAssetsLargeImage('https://cdn.discordapp.com/attachments/962264704573665280/1236162951753240576/ban-hot.gif?ex=663701f6&is=6635b076&hm=b3ec60f60f83740b736150301e11604d69e0d1dc47c73e168fd9f6f3136c8b05&') 
    .setAssetsLargeText('BAN')
    .setAssetsSmallImage('https://cdn.discordapp.com/attachments/1172862481140559893/1218707256036556871/small.gif?ex=66362054&is=6634ced4&hm=5c5f0bdc398d35dafd9e508d51809700106f59ccbc7e7dea24a1a509cad11cd9&')
    .setAssetsSmallText('WAITING...!')
     client.user.setActivity(r);
     client.user.setPresence({ status: "dnd" });
})

client.login(process.env.spakalaw)