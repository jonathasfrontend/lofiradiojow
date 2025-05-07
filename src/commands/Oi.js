const { EmbedBuilder } = require("discord.js");
const { client } = require("../Client");
const { erro, info } = require('../Logger');

async function Oi(interaction) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === 'oi') {
      const embed = await new EmbedBuilder()
        .setColor(0xffffff)
        .set
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`**Oi **${interaction.user}`);

      await interaction.reply({ embeds: [embed] });

      const logChannel = client.channels.cache.get(process.env.CHANNEL_ID_LOGS_INFO_BOT);
      await logChannel.send(`O comando ${commandName} foi executado por ${interaction.user.tag} no canal ${interaction.channelId}`);
      info.info(`O comando ${commandName} foi executado por ${interaction.user.tag} no canal ${interaction.channelId}`);
    }
  } catch (error) {
    erro.error('Erro ao executar o comando oi', error);
    const logChannel = client.channels.cache.get(process.env.CHANNEL_ID_LOGS_ERRO_BOT);
    await logChannel.send(`Erro ao executar o comando oi ${error.message}`);
  }
};

module.exports = { Oi };