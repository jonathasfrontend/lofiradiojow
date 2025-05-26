const { info } = require('./Logger');
const { client } = require('./Client');

const { Oi } = require('./commands/Oi');
// Music
const { Play } = require('./commands/Music/Play')
const { StationCommand } = require('./commands/Music/station')
const { Stop } = require('./commands/Music/stop')
const { Song } = require('./commands/Music/song')
const { Volume } = require('./commands/Music/volume')
const { Sleep } = require('./commands/Music/sleep')
// Information
const { Ajuda } = require('./commands/Information/ajuda')

const { Status } = require('./functions/statusBot')

const { kazagumoInstance } = require('./config/kazagumo');
const { bdServerConect } = require('./config/bdServerConect')

require('dotenv').config()

client.once('ready', async () => {
  Status();
  bdServerConect();
  client.kazagumo = kazagumoInstance;
  info.info('O bot Lo-fi Radio está online!');

  client.application?.commands.create({
    name: 'ajuda',
    description: 'Mostra os comandos disponíveis.',
  });

  client.application?.commands.create({
    name: 'oi',description: 'Responde com oi!',
    
  });

  client.application?.commands.create({
    name: 'play',
    description: 'Entra no seu canal de voz e começa a tocar 24/7.',
  });

  client.application?.commands.create({
    name: 'station',
    description: 'Muda a estação/tema da rádio.',
  });

  client.application?.commands.create({
    name: 'stop',
    description: 'Sai do canal de voz.',
  });

  client.application?.commands.create({
    name: 'song',
    description: 'Mostra a música que está tocando no momento',
  });

  client.application?.commands.create({
    name: 'volume',
    description: 'Ajusta o volume da rádio.',
    options: [
      {
        name: 'amount',
        description: 'Novo valor do volume (0 a 100)',
        type: 10, // NUMBER
        required: true,
      },
    ],
  });

  client.application?.commands.create({
    name: 'sleep',
    description: 'Configura um temporizador de sono e muda a estação para Sleep lo-fi.',
  });

});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'oi') {
    await Oi(interaction);
  } else if (commandName === 'play') {
    await Play(interaction);
  } else if (commandName === 'station') {
    await StationCommand(interaction);
  } else if (commandName === 'stop') {
    await Stop(interaction);
  } else if (commandName === 'song') {
    await Song(interaction);
  } else if (commandName === 'volume') {
    await Volume(interaction);
  } else if (commandName === 'sleep') {
    await Sleep(interaction);
  } else if (commandName === 'ajuda') {
    await Ajuda(interaction);
  }
});

client.login(process.env.TOKEN);
