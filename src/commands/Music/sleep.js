const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Station = require('../../models/station');
const { info, erro } = require('../../Logger');
const { client } = require('../../Client');

// 1. Cache das opções de menu e botões
const SLEEP_OPTIONS = [
  { label: '30 Minutos', value: '30', emoji: '⏱️' },
  { label: '1 Hora', value: '60', emoji: '⏱️' },
  { label: '1h30', value: '90', emoji: '⏱️' },
  { label: '2 Horas', value: '120', emoji: '⏱️' },
];
const sleepMenu = new StringSelectMenuBuilder()
  .setCustomId('sleep')
  .setPlaceholder('🌙 Configurar temporizador de sono')
  .addOptions(SLEEP_OPTIONS);

const cancelButton = new ButtonBuilder()
  .setCustomId('cancel')
  .setLabel('Cancelar')
  .setEmoji('❌')
  .setStyle(ButtonStyle.Secondary);

async function Sleep(interaction) {
  if (!interaction.isCommand()) return;

  // 2. Validações iniciais rápidas
  if (!interaction.member?.voice.channel) {
    return interaction.reply({
      embeds: [new EmbedBuilder().setColor('#FF0000')
        .setDescription('❌ Você precisa estar em um canal de voz!')],
      ephemeral: true
    });
  }

  // 3. Defer apenas após validações
  await interaction.deferReply();

  // 4. Upsert único para obter ou criar estação
  const doc = await Station.findOneAndUpdate(
    { Guild: interaction.guildId },
    { $setOnInsert: { Guild: interaction.guildId, oldradio: '', Radio: 'Sleep lo-fi' } },
    { upsert: true, new: true, lean: true }
  ).exec();

  // 5. Mensagem inicial com menu
  const embed = new EmbedBuilder()
    .setColor('#DDBD86')
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setDescription('🌙 **Temporizador de Sono** inativo. Selecione duração:');
  const row = new ActionRowBuilder().addComponents(sleepMenu);
  const message = await interaction.editReply({ embeds: [embed], components: [row] });

  // 6. Coletor para seleção de tempo
  const filter = i => i.customId === 'sleep' && i.user.id === interaction.user.id;
  const collector = message.createMessageComponentCollector({ filter, time: 60_000 });

  let timeoutHandle;
  collector.on('collect', async i => {
    await i.deferUpdate();

    const minutes = parseInt(i.values[0], 10);
    const ms = minutes * 60 * 1000;

    // 7. Atualiza estação no banco (sleep) e registra oldradio
    await Station.findOneAndUpdate(
      { Guild: interaction.guildId },
      {
        $set: {
          oldradio: doc.Radio,
          Radio: 'sleep'
        }
      },
      { new: true, lean: true }
    ).exec();

    // 8. Agendar desconexão
    timeoutHandle = setTimeout(() => {
      const vc = interaction.member.voice.channel;
      if (vc) vc.leave();
      interaction.channel.send(`⏲️ **Sleep Timer**: ${interaction.user} desconectado após ${minutes} minutos.`);
    }, ms);

    // 9. Mensagem de confirmação com botão de cancelamento
    const activeEmbed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription(`⏲️ Temporizador ativo: desligará em **${minutes} minutos**`);
    const cancelRow = new ActionRowBuilder().addComponents(cancelButton);
    await i.editReply({ embeds: [activeEmbed], components: [cancelRow] });
    info.info(`Sono configurado: ${minutes}min por ${interaction.user.id}`);

    // 10. Coletor do botão de cancelamento
    const cancelFilter = b => b.customId === 'cancel' && b.user.id === interaction.user.id;
    const cancelCollector = message.createMessageComponentCollector({ filter: cancelFilter, time: ms });
    cancelCollector.on('collect', async b => {
      clearTimeout(timeoutHandle);
      const cancelEmbed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setDescription('⏹️ **Temporizador cancelado**');
      await b.update({ embeds: [cancelEmbed], components: [] });
      collector.stop(); cancelCollector.stop();
      info.info(`Sono cancelado por ${interaction.user.id}`);
    });
  });

  collector.on('end', async (_, reason) => {
    if (reason === 'time') {
      // 11. Desativa menu por timeout
      await message.edit({ components: [] }).catch(() => { });
    }
  });
}

module.exports = { Sleep };
