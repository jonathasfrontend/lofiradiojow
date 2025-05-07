const { EmbedBuilder } = require('discord.js');

async function Stop(interaction) {
  if (!interaction.isCommand()) return;

  // Verifica se o usuário que executou o comando está em um canal de voz
  if (!interaction.member.voice.channel) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription("❌ Você precisa estar em um canal de voz para usar este comando!");
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: false });

  // Obtém o player associado à guild
  let player = interaction.client.kazagumo.players.get(interaction.guildId);
  if (!player) {
    const notConnectedEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription("❌ O bot não está conectado em nenhum canal de voz.");
    return interaction.editReply({ embeds: [notConnectedEmbed] });
  }

  // Destrói o player para desconectar o bot do canal de voz
  player.destroy();

  const playedEmbed = new EmbedBuilder()
    .setColor("#DDBD86")
    .setDescription(` Desconectado com sucesso por ${interaction.member.voice.channel}`);
  await interaction.editReply({ embeds: [playedEmbed] });
}

module.exports = { Stop };