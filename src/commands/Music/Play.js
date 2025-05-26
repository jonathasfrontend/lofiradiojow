const { EmbedBuilder } = require('discord.js');
const Station = require('../../models/station');

// 1. Pré-carregamento dos dados de estação
const stations = {
    'default': require('../../songs/default.json').words,
    'study': require('../../songs/study.json').words,
    'anime': require('../../songs/anime.json').words,
    'halloween ': require('../../songs/halloween.json').words,
    'gaming': require('../../songs/gaming.json').words,
    'sleep': require('../../songs/sleep.json').words,
    'synthwave': require('../../songs/synthwave.json').words,
    'japanese ': require('../../songs/japanese.json').words,
    'kpop': require('../../songs/kpop.json').words,
    'jazz': require('../../songs/jazz.json').words,
    'covers': require('../../songs/covers.json').words,
    'christmas': require('../../songs/christmas.json').words,
    'mix': require('../../songs/mix.json').words,
    'gospel': require('../../songs/gospel.json').words,
};

async function Play(interaction) {
    if (!interaction.isCommand()) return;

    // 2. Verificações iniciais antes de defer
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#DDBD86')
                    .setDescription('<:loud:1364257411115782144> Você precisa estar em um canal de voz para usar este comando!')
            ],
            ephemeral: true
        });
    }

    // 3. Checagem de player existente
    const guildId = interaction.guildId;
    let player = interaction.client.kazagumo.players.get(guildId);
    if (player?.voiceChannel) {
        const sameChannel = player.voiceChannel.id === voiceChannel.id;
        const embed = new EmbedBuilder()
            .setColor(sameChannel ? '#DDBD86' : '#FF0000')
            .setDescription(
                sameChannel
                    ? '<:loud:1364257411115782144> O bot já está conectado neste canal de voz.'
                    : '<:error:1364257210745487422> O bot já está conectado em outro canal de voz.'
            );
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // 4. Defer agora
    await interaction.deferReply({ ephemeral: false });

    // 5. Consulta e upsert em uma única operação
    const res = await Station.findOneAndUpdate(
        { Guild: guildId },                              // filtro
        { $setOnInsert: { Guild: guildId } },            // upsert: define Guild apenas se novo
        { new: true, upsert: true, lean: true }           // retorna POJO e cria se não existir
    ).exec();                                          // lean() torna o objeto mais leve

    const station = res.Radio || 'default';

    // 6. Seleção de query de forma eficiente (cache acima)
    const words = stations[station] || stations['default'];
    const query = words[Math.floor(Math.random() * words.length)];

    // 7. Criação do player e busca simultâneas
    [player] = await Promise.all([
        (async () => {
            if (!player) {
                return interaction.client.kazagumo.createPlayer({
                    guildId,
                    voiceId: voiceChannel.id,
                    textId: interaction.channelId,
                    deaf: true
                });
            }
            // Se o player existia mas sem canal (remoção manual), recria-o
            return interaction.client.kazagumo.createPlayer({
                guildId,
                voiceId: voiceChannel.id,
                textId: interaction.channelId,
                deaf: true
            });
        })(),
        // Poderíamos paralelizar outras operações aqui, se necessário
    ]);

    // 8. Busca e enfileiramento
    const result = await player.search(query, { requester: interaction.user });
    if (!result.tracks.length) {
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#DDBD86')
                    .setDescription('<:error:1364257210745487422> Nenhum resultado encontrado. Tente novamente mais tarde.')
            ]
        });
    }
    if (result.type === 'PLAYLIST') {
        player.queue.add(result.tracks);
        player.setLoop('queue');
    } else {
        player.queue.add(result.tracks[0]);
    }

    // 9. Inicia reprodução se necessário
    if (!player.playing && !player.paused) player.play();
    await player.setLoop('queue');

    // 10. Embed final
    const playedEmbed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setDescription(`
            <:notes:1364257513054146652> Conectado com sucesso no canal: <#${voiceChannel.id}>.
            <:blank:1364257084660650014><:dvd:1364257189887213628> **Entrou no canal de voz a tocar 24/7.**
        `);
    await interaction.editReply({ embeds: [playedEmbed] });
}

module.exports = { Play };