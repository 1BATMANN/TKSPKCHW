require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const channels = ['1247316151944347658'];
let cooldown = false;

const client = new Client({ checkUpdate: true });

const checkAndJoin = async (client, channelId) => {
  try {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.error(`Channel not found with ID: ${channelId}`);
      return;
    }

    const guild = channel.guild;
    const member = guild.members.cache.get(client.user.id);

    if (!member) {
      console.error(`Bot is not a member of the guild (${guild.name}) associated with the channel ID: ${channelId}`);
      return;
    }

    const userVoiceState = guild.voiceStates.cache.get(member.id);

    if (!userVoiceState || !userVoiceState.channelId) {
      const voiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfMute: true,
        selfDeaf: true,
      });

      voiceConnection.once('stateChange', (state) => {
        if (state.status === 'CONNECTED') {
          console.log(`${member.displayName} is in ${guild.name}`);
          console.log(`Bot joined voice channel ${channel.name} in ${guild.name}`);
        }
      });

      voiceConnection.on('error', (error) => {
        console.error('Error in voice connection:', error);
      });
    }
  } catch (error) {
    console.error('Error checking and joining:', error);
  }
};

const handleDeleteMessages = async (message, deleteCount) => {
  try {
    const fetchedMessages = await message.channel.messages.fetch({ limit: deleteCount });
    const botMessages = fetchedMessages.filter(msg => msg.author.id === message.author.id);

    for (const msg of botMessages.values()) {
      await deleteMessage(msg);
    }

    console.log(`Deleted ${botMessages.size} messages`);
  } catch (error) {
    console.error('Error deleting messages:', error);
  }
};

const handleDeleteAllMessages = async (message) => {
  try {
    let lastMessageId;
    while (true) {
      const fetchedMessages = await message.channel.messages.fetch({ limit: 100, before: lastMessageId });
      const botMessages = fetchedMessages.filter(msg => msg.author.id === message.author.id);

      if (botMessages.size === 0) break;

      for (const msg of botMessages.values()) {
        await deleteMessage(msg);
      }

      lastMessageId = fetchedMessages.last().id;
    }

    console.log('Deleted all messages');
  } catch (error) {
    console.error('Error deleting all messages:', error);
  }
};

const deleteMessage = async (message) => {
  try {
    if (message) {
      await message.delete();
      console.log(`Deleted message with ID: ${message.id}`);
    } else {
      console.log('Message does not exist or has already been deleted');
    }
  } catch (error) {
    console.error('Error deleting message:', error);
  }
};

const handleLockCommand = async (message) => {
  try {
    await message.channel.send('.v lock');
    console.log('Sent lock command');
    await deleteMessage(message);
  } catch (error) {
    console.error('Error sending lock command:', error);
  }
};

const handleUnlockCommand = async (message) => {
  try {
    await message.channel.send('.v unlock');
    console.log('Sent unlock command');
    await deleteMessage(message);
  } catch (error) {
    console.error('Error sending unlock command:', error);
  }
};

const handleLimitCommand = async (message, limit) => {
  try {
    await message.channel.send(`.v limit ${limit}`);
    console.log(`Sent limit command with limit: ${limit}`);
    await deleteMessage(message);
  } catch (error) {
    console.error('Error sending limit command:', error);
  }
};

const handleRejectCommand = async (message, id) => {
  try {
    await message.channel.send(`.v reject ${id}`);
    console.log(`Sent reject command with ID: ${id}`);
  } catch (error) {
    console.error('Error sending reject command:', error);
  }
};

const handle9WDCommand = async (message, ids) => {
  try {
    const idArray = ids.split(' ');
    for (const id of idArray) {
      await handleRejectCommand(message, id);
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second cooldown
    }
    await deleteMessage(message); // Delete the command message after execution
  } catch (error) {
    console.error('Error handling 9WD command:', error);
  }
};

client.once('ready', () => {
  channels.forEach((channelId) => {
    checkAndJoin(client, channelId);
    setInterval(() => checkAndJoin(client, channelId), 10000); // check every 10 seconds
  });
});

client.on('messageCreate', async (message) => {
  if (message.author.id !== client.user.id) return;

  const commandPrefix = '?';
  const command = message.content.trim();

  if (!command.startsWith(commandPrefix)) return;

  const commandBody = command.slice(commandPrefix.length).toUpperCase();
  const deleteCountMatch = commandBody.match(/^DEL (\d+)$/);

  if (deleteCountMatch) {
    const deleteCount = parseInt(deleteCountMatch[1], 10);
    if (!isNaN(deleteCount)) {
      await handleDeleteMessages(message, deleteCount);
      await deleteMessage(message); // Delete the command message after execution
    }
  } else if (commandBody === 'DEL ALL') {
    await handleDeleteAllMessages(message);
    await deleteMessage(message); // Delete the command message after execution
  } else if (commandBody === 'SED') {
    await handleLockCommand(message);
    await deleteMessage(message); // Delete the command message after execution
  } else if (commandBody === '7EL') {
    await handleUnlockCommand(message);
    await deleteMessage(message); // Delete the command message after execution
  } else if (commandBody.includes('L')) {
    const limit = parseInt(commandBody.split('L')[1]);
    if (!isNaN(limit)) {
      await handleLimitCommand(message, limit);
      await deleteMessage(message); // Delete the command message after execution
    }
  } else if (commandBody.startsWith('9WD')) {
    if (!cooldown) {
      const ids = commandBody.slice(3).trim();
      await handle9WDCommand(message, ids);
      cooldown = true;
      setTimeout(() => { cooldown = false; }, 3000); // 3-second cooldown
    } else {
      console.log('Cooldown active for 9WD command');
    }
  }
});

client.login(process.env.satan);
