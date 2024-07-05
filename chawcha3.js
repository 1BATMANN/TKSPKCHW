require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, getVoiceConnection, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const targetUserIds = ['888998939708244039']; // List of user IDs to listen to
const followCommand = 'AJIW';
const goCommand = '9AWDU';
const specificChannelId = '1237099573348929617';
const joinDelay = 1000; // 1000 milliseconds (1 second)
const afkTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const replyDelay = 1000; // 1000 milliseconds (1 second) between replies

const client = new Client({ checkUpdate: false });

let voiceConnection = null;
let lastMessageIds = []; // Store message IDs of random replies
let followVoice = false; // Flag to determine whether to follow the user's voice channel

client.once('ready', () => {
  console.log(`Bot is ready`);
});

async function afkInChannel() {
  const targetChannel = client.channels.cache.get(specificChannelId);
  if (targetChannel && targetChannel.type === 'GUILD_VOICE') {
    try {
      voiceConnection = joinVoiceChannel({
        channelId: targetChannel.id,
        guildId: targetChannel.guild.id,
        adapterCreator: targetChannel.guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: false,
      });
      voiceConnection.once(VoiceConnectionStatus.Ready, async () => {
        console.log(`Bot joined voice channel ${targetChannel.name}`);
        await entersState(voiceConnection, VoiceConnectionStatus.Ready, afkTimeout);
        voiceConnection.destroy();
        console.log(`Bot left voice channel ${targetChannel.name} after AFK timeout`);
      });
      voiceConnection.on('error', (error) => {
        console.error('Error in voice connection:', error);
      });
    } catch (error) {
      console.error('Error joining voice channel:', error);
    }
  } else {
    console.error(`Target channel ${specificChannelId} not found or not a voice channel`);
  }
}

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (targetUserIds.includes(newState.id)) {
    if (oldState.channelId !== newState.channelId) {
      const connection = getVoiceConnection(newState.guild.id);
      if (connection) {
        connection.destroy();
      }
      if (newState.channel) {
        console.log(`${newState.member.displayName} joined voice channel ${newState.channel.name}`);
        if (followVoice) {
          setTimeout(() => {
            voiceConnection = joinVoiceChannel({
              channelId: newState.channel.id,
              guildId: newState.guild.id,
              adapterCreator: newState.guild.voiceAdapterCreator,
              selfMute: false,
              selfDeaf: false,
            });
            voiceConnection.once(VoiceConnectionStatus.Ready, () => {
              console.log(`Bot joined voice channel ${newState.channel.name}`);
            });
            voiceConnection.on('error', (error) => {
              console.error('Error in voice connection:', error);
            });
          }, joinDelay);
        }
      } else {
        console.log(`${newState.member.displayName} left voice channel`);
      }
    }
  }
});

client.on('messageCreate', async (message) => {
  if (targetUserIds.includes(message.author.id)) {
    if (message.content === followCommand) {
      // Follow command "AJIW"
      followVoice = true;
      const userVoiceChannel = message.member.voice.channel;
      if (userVoiceChannel) {
        try {
          voiceConnection = joinVoiceChannel({
            channelId: userVoiceChannel.id,
            guildId: userVoiceChannel.guild.id,
            adapterCreator: userVoiceChannel.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false,
          });
          voiceConnection.once(VoiceConnectionStatus.Ready, () => {
            console.log(`Bot joined voice channel ${userVoiceChannel.name}`);
          });
          voiceConnection.on('error', (error) => {
            console.error('Error in voice connection:', error);
          });
        } catch (error) {
          console.error('Error joining voice channel:', error);
        }
      } else {
        console.error('User is not in a voice channel.');
      }
    } else if (message.content === goCommand) {
      // Go command "9AWDU"
      followVoice = false; // Stop following user's voice channel
      await afkInChannel();
    } else if (message.content === 'SLM A W9' && voiceConnection && voiceConnection.joinConfig.channelId === message.member.voice.channelId) {
      try {
        const sentMessage = await message.channel.send('TA7IYATY SIDNA SATAN');
        lastMessageIds.push(sentMessage.id);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else if (message.content === 'MS7 L9LAWI' && lastMessageIds.length > 0) {
      const lastMsgId = lastMessageIds.pop(); // Get and remove the last message ID
      const msg = message.channel.messages.cache.get(lastMsgId);
      if (msg) {
        try {
          await msg.delete();
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      }
    } else if (message.content === 'HA RAMBO') {
      const replies = ["AHLAN SI HAMZA", "FEN A KHAY HAMZI", "FEN AL CAPO"];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      try {
        const sentMessage = await message.channel.send(randomReply);
        lastMessageIds.push(sentMessage.id);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else if (message.content.startsWith('SEBU') || message.content.startsWith('3AYRU') || message.content.startsWith('SEBU TBUN MO') || message.content.startsWith('3AYRO L97BAT MO') || message.content.startsWith('ATAK LO')) {
      const replies = ["LAH YN3AL TBUN MOK", "LAH Y7RE9 DIN TBUN MOK", "WELD LMTELGA", "WELD 3ACHI9AT LFASSAD", "WELD 9LILLT L97BAT", "SKOT T7WA YA WELD L97BA", "LAH Y7RE9 TBUN MOK YAWMIYAN YA WELD L97BA"];
      const replyInterval = setInterval(async () => {
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        try {
          const sentMessage = await message.channel.send(randomReply);
          lastMessageIds.push(sentMessage.id);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }, replyDelay);
      setTimeout(() => {
        clearInterval(replyInterval);
      }, 7 * replyDelay); // Stop after 7 replies (1 * 7 = 7 seconds)
    } else if (message.content === 'MS7 KULSHY') {
      // Delete only the bot's messages sent in the channel
      try {
        const botMessages = message.channel.messages.cache.filter(msg => msg.author.id === client.user.id);
        botMessages.forEach(async (msg) => {
          await msg.delete();
        });
      } catch (error) {
        console.error('Error deleting bot messages:', error);
      }
    } else if (message.content === 'SF LAH YSAME7' || message.content === 'SF' || message.content === 'BARAKA ELIH') {
      // Stop sending replies
      return;
    } else if (message.content === 'mute' && voiceConnection) {
      voiceConnection.setSelfMute(true);
      console.log('Bot is self-muted');
    } else if (message.content === 'unmute' && voiceConnection) {
      voiceConnection.setSelfMute(false);
      console.log('Bot is unmuted');
    } else if (message.content === 'deafen' && voiceConnection) {
      voiceConnection.setSelfDeaf(true);
      console.log('Bot is self-deafened');
    } else if (message.content === 'undeafen' && voiceConnection) {
      voiceConnection.setSelfDeaf(false);
      console.log('Bot is undeafened');
    }
  }
});

client.login(process.env.chawcha3);
