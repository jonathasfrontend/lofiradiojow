const { EmbedBuilder } = require('discord.js');

async function Volume(interaction) {
  if (!interaction.isCommand()) return;

  // 2. Validar canal de voz
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {

    const embed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription('<:error:1364257210745487422> Você precisa estar em um canal de voz para usar este comando!');

    return interaction.reply({ embeds: [embed], ephemeral: true});
  }

  // 3. Validar estado de reprodução
  const player = interaction.client.kazagumo.players.get(interaction.guildId);
  if (!player?.queue?.current) {
      const embed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setDescription('<:error:1364257210745487422> Não há nenhuma música tocando no momento.')
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // 4. Validar valor do volume
  const volume = interaction.options.getNumber('amount');
  if (volume == null || volume < 0 || volume > 100) {
    const embed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription('<:error:1364257210745487422> Volume inválido! Use `/volume <0-100>`')
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // 5. Ajustar volume (síncrono, inlineVolume desabilitado por padrão) 
  await player.setVolume(volume);
  // 6. Resposta de sucesso
    const embed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription(`
        <:dvd:1364257189887213628> O volume foi alterado com sucesso
        <:blank:1364257084660650014><:loud:1364257411115782144> **Volume atual: ${volume}%**
      `)
  return interaction.reply({ embeds: [embed] });
}

module.exports = { Volume };