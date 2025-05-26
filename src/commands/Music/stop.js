const { EmbedBuilder } = require('discord.js');

async function Stop(interaction) {
  if (!interaction.isCommand()) return;

  await interaction.deferReply({ ephemeral: true });

  // Obtém o player associado à guild
  let player = interaction.client.kazagumo.players.get(interaction.guildId);
  if (!player) {
    const notConnectedEmbed = new EmbedBuilder()
      .setColor("#DDBD86")
      .setDescription("<:error:1364257210745487422> Já fui desconectado. Use </play:1311787727754104862> para me fazer entrar no seu canal.");
    return interaction.editReply({ embeds: [notConnectedEmbed], ephemeral: true });
  }

  // Destrói o player para desconectar o bot do canal de voz
  player.destroy();

  const playedEmbed = new EmbedBuilder()
    .setColor("#DDBD86")
    .setDescription(`<:stop:1364257663613009930> Desconectado com sucesso de <#${interaction.member.voice.channel.id}>.`);
  await interaction.editReply({ embeds: [playedEmbed] });
}

module.exports = { Stop };