const { EmbedBuilder } = require('discord.js');

async function Volume(interaction) {
  if (!interaction.isCommand()) return;

  // 2. Validar canal de voz
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('❌ Você precisa estar em um canal de voz para usar este comando!');

    return interaction.reply({ embeds: [embed], ephemeral: true});
  }

  // 3. Validar estado de reprodução
  const player = interaction.client.kazagumo.players.get(interaction.guildId);
  if (!player?.queue?.current) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('❌ Não há nenhuma música tocando no momento.')
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // 4. Validar valor do volume
  const volume = interaction.options.getNumber('amount');
  if (volume == null || volume < 0 || volume > 100) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('❌ Volume inválido! Use `/volume <0-100>`')
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // 5. Ajustar volume (síncrono, inlineVolume desabilitado por padrão) 
  await player.setVolume(volume);
  // 6. Resposta de sucesso
    const embed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription(`🔊 Volume ajustado para **${volume}%**`)
  return interaction.reply({ embeds: [embed] });
}

module.exports = { Volume };