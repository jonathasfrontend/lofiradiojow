const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Playlist = require('../../models/playlist');
const { client } = require("../../Client");

async function Song(interaction) {
  if (!interaction.isCommand()) return;

  // Defer reply para operações assíncronas
  await interaction.deferReply({ ephemeral: false });

  // Obtém o player do Kazagumo para esta guild
  const player = client.kazagumo.players.get(interaction.guildId);
  const current = player?.queue.current;

  // Se não houver música tocando
  if (!current) {
    const noMusicEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('❌ Não há nenhuma música tocando no momento.');
    return interaction.editReply({ embeds: [noMusicEmbed] });
  }

  // Embed principal com informações da música
  const songEmbed = new EmbedBuilder()
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.displayAvatarURL(),
    })
    .setColor("#DDBD86")
    .setDescription(`🎵 Tocando agora:
                      **${current.author} - ${current.title}**`);

  // Botões de ação
  const spotifyButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel('Spotify')
    .setEmoji('🟢')
    .setURL(current.uri);

  const ytButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel('YouTube')
    .setEmoji('🔴')
    .setURL(`https://www.youtube.com/watch?v=${current.identifier}`);

  const likeButton = new ButtonBuilder()
    .setCustomId('like')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('👍');

  const dislikeButton = new ButtonBuilder()
    .setCustomId('dislike')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('👎');

  const row = new ActionRowBuilder().addComponents(
    spotifyButton,
    ytButton,
    likeButton,
    dislikeButton
  );

  // Envia embed e botões
  const message = await interaction.editReply({
    embeds: [songEmbed],
    components: [row],
  });

  client.on('interactionCreate', async (buttonInteraction) => {
    if (!buttonInteraction.isButton()) return;

    if (buttonInteraction.customId === 'like') {
      await Playlist.findOneAndUpdate(
        { UserId: interaction.user.id, PlaylistName: 'Favorites' },
        {
          $setOnInsert: {
            UserName: interaction.user.tag,
            CreatedOn: Math.floor(Date.now() / 1000),
          },
          $push: {
            Playlist: {
              title: current.title,
              uri: current.uri,
              author: current.author,
              duration: current.length,
            },
          },
        },
        { upsert: true, new: true, lean: true }
      ).exec();

      const likeEmbed = new EmbedBuilder()
          .setColor("#DDBD86")
          .setDescription(`**<:notes:1119915814733217843> Adicionada a playlist!**`)
      await buttonInteraction.reply({ embeds: [likeEmbed], ephemeral: true });
      
    }

    if (buttonInteraction.customId === 'dislike') {
      const fav = new EmbedBuilder()
          .setColor("#DDBD86")
          .setDescription(`**<:notes:1119915814733217843> Valew por votar!**`)
      await buttonInteraction.reply({ embeds: [fav], ephemeral: true });
    }

    // desabilitar botões após a interação  
    const updatedRow = new ActionRowBuilder().addComponents(
      spotifyButton.setDisabled(false),
      ytButton.setDisabled(false),
      likeButton.setDisabled(true),
      dislikeButton.setDisabled(true)
    );
    await message.edit({ components: [updatedRow] });

  });
}

module.exports = { Song };