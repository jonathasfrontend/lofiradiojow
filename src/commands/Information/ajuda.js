const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { client } = require("../../Client");
const { erro, info } = require('../../Logger');

async function Ajuda(interaction) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === 'ajuda') {
      const helpEmbed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(`
                  <:notes:1364257513054146652> **Music:**
                  <:blank:1364257084660650014><:next:1364257491424116736> **/play:** Toca 24/7 no seu canal de voz.
                  <:blank:1364257084660650014><:stop:1364257663613009930> **/stop:** Sai do canal de voz.
                  <:blank:1364257084660650014><:dvd:1364257189887213628> **/song:** Mostra a música atual.
                  <:blank:1364257084660650014><:radio:1364257569505415299> **/station:** Altera a estação.
                  <:blank:1364257084660650014><:loud:1364257411115782144> **/volume:** Altera o volume (0–100).
                  <:blank:1364257084660650014><:sleep:1364257588035977348> **/sleep:** Temporizador de sono.
                  <:star:1364257635464908901> **Profiles:**
                  <:blank:1364257084660650014><:profile:1364257553239769180> **/profile:** Exibe seu perfil.
                  <:blank:1364257084660650014><:am:1364257057145884715> **/remove:** Remove a música curtida.
                  <:blank:1364257084660650014><:floppy_disk:1364257265288216697> **/collection:** Mostra suas músicas favoritas.
                  <:config:1364257112506765425> **Config:**
                  <:blank:1364257084660650014><:mode:1364257442883436615> **/mode:** Muda modo de rádio.
                  <:blank:1364257084660650014><:dj:1364257135873228835> **/djrole:** Define quais funções são consideradas DJs.
                  <:blank:1364257084660650014><:gear:1364257285471342622> **/settings:** Exibe e configura as configurações do servidor.
                  <:blank:1364257084660650014><:premium:1364257537175851190>  **/premium:** Mostra informações sobre Lofi Radio premium.
                  <:info:1364257347970797700> **Info:**
                  <:blank:1364257084660650014><:telegram:1364257684060377119> **/support:** Send us a message or [join](https://discord.gg/aromax-development-708565122188312579) our support server.
                  <:blank:1364257084660650014><:like:1364257383869579377> **/vote:** Vote for Lofi Radio.
                  <:blank:1364257084660650014><:invite:1364257366941499532> **/invite:** [Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands) Lofi Radio to your server. 
        `);

      await interaction.reply({ embeds: [helpEmbed] });
      
    }
  } catch (error) {
    erro.error('Erro ao executar o comando /ajuda:', error);
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('❌ Ocorreu um erro ao executar o comando. Tente novamente mais tarde.');
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}

module.exports = { Ajuda };