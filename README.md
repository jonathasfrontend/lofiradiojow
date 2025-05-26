# Bot Lo-fi Radio Jow - Documentação

## **Sumário**

1. [Introdução](#introdução)
2. [Visão Geral](#visão-geral)
3. [Requisitos](#requisitos)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [Estrutura do Projeto](#estrutura-do-projeto)
6. [Eventos](#eventos)
7. [Comandos](#comandos)
   - [Usuários](#usuários)
8. [Funções Principais](#funções-principais)
9. [Instalação e Execução](#instalação-e-execução)
10. [Conclusão](#conclusão)

---

## **Introdução**

O **Bot Lo-fi Radio Jow** é um bot de música para servidores Discord, projetado para oferecer uma experiência musical contínua e relaxante. Com foco em estações de rádio temáticas como lo-fi, jazz e outras, ele permite que os usuários controlem a reprodução, ajustem o volume e configurem temporizadores de sono, tornando-o ideal para criar atmosferas agradáveis em canais de voz.

---

## **Visão Geral**

- **Linguagem**: Node.js
- **Bibliotecas**: Discord.js, dotenv, mongoose, kazagumo, shoukaku
- **Banco de Dados**: MongoDB
- **Principais Recursos**:
  - Reprodução de música 24/7 em canais de voz
  - Alternância entre estações de rádio temáticas
  - Controle de volume e temporizador de sono
  - Integração com plataformas como Spotify e YouTube via Kazagumo

---

## **Requisitos**

Para rodar o bot, você precisará de:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn** para gerenciar pacotes
- **MongoDB** para armazenamento de dados
- **Lavalink** (servidor de áudio para streaming de música)

Instale as dependências com:

```bash
npm install
```

---

## **Configuração do Ambiente**

1. Crie um arquivo `.env` na raiz do projeto.
2. Insira as seguintes variáveis de ambiente:

   ```env
   TOKEN=SEU_TOKEN_DO_BOT
   MONGO_URI=URL_DO_SEU_BANCO_DE_DADOS
   SPOTIFY_CLIENT_ID=SEU_CLIENT_ID_DO_SPOTIFY
   SPOTIFY_CLIENT_SECRET=SEU_CLIENT_SECRET_DO_SPOTIFY
   NODE_URL=URL_DO_SEU_SERVIDOR_LAVALINK
   NODE_AUTH=SENHA_DO_SEU_SERVIDOR_LAVALINK
   NODE_SECURE=true_ou_false
   ```

3. Substitua os valores pelos seus dados específicos.

---

## **Estrutura do Projeto**

A organização do projeto segue boas práticas para modularidade e manutenção. Abaixo está uma visão geral:

```plaintext
/src
  /commands
    /Music
      Play.js
      station.js
      stop.js
      song.js
      volume.js
      sleep.js
    /Information
      ajuda.js
    Oi.js
  /config
    kazagumo.js
    bdServerConect.js
  /functions
    statusBot.js
  /models
    station.js
Client.js
index.js
Logger.js
```

- **`index.js`**: Arquivo principal que inicializa o bot, registra comandos e eventos.
- **`/commands`**: Contém os comandos organizados por categoria (Music e Information).
- **`/config`**: Arquivos de configuração para Kazagumo e conexão com o banco de dados.
- **`/functions`**: Funções utilitárias como o status do bot.

---

## **Eventos**

### **`ready`**

- Dispara quando o bot está pronto para uso.
- Executa:
  - Define o status do bot.
  - Conecta ao banco de dados MongoDB.
  - Inicializa o Kazagumo para reprodução de música.
  - Registra no console: `O bot Lo-fi Radio está online!`
- Registra todos os comandos slash no Discord.

### **`interactionCreate`**

- Gerencia interações de comandos slash, chamando a função correspondente ao comando solicitado.

---

## **Comandos**

### **Usuários**

- **`/ajuda`**: Mostra a lista de comandos disponíveis.
- **`/oi`**: Responde com uma saudação simples.
- **`/play`**: Inicia a reprodução de música 24/7 no canal de voz do usuário.
- **`/station`**: Permite mudar a estação de rádio atual (ex.: lo-fi, jazz).
- **`/stop`**: Para a reprodução e desconecta o bot do canal de voz.
- **`/song`**: Exibe informações sobre a música ou estação atual.
- **`/volume [amount]`**: Ajusta o volume da música (valores de 0 a 100).
- **`/sleep`**: Configura um temporizador de sono e alterna para a estação "Sleep lo-fi".

*Nota*: Não há comandos exclusivos para moderadores, pois o bot é focado em funcionalidades musicais para todos os usuários.

---

## **Funções Principais**

- **`Status`** (`statusBot.js`): Define o status do bot no Discord (ex.: "Ouvindo lo-fi").
- **`bdServerConect`** (`bdServerConect.js`): Estabelece a conexão com o banco de dados MongoDB.
- **`kazagumoInstance`** (`kazagumo.js`): Configura o Kazagumo para gerenciar a reprodução de músicas, com suporte a fontes como Spotify e YouTube.

---

## **Instalação e Execução**

### **Instalação das Dependências**

No diretório do projeto, execute:

```bash
npm install
```

### **Executando o Projeto**

Para iniciar o bot:

```bash
npm start
```

*Pré-requisito*: Certifique-se de que o servidor Lavalink esteja rodando e configurado corretamente nas variáveis de ambiente.

---

## **Conclusão**

O **Bot Lo-fi Radio Jow** é uma solução prática e eficiente para adicionar música contínua e relaxante a servidores Discord. Sua arquitetura modular facilita expansões futuras, enquanto os comandos intuitivos garantem uma experiência acessível para todos os usuários. Seja para estudar, relaxar ou socializar, este bot é uma excelente adição a qualquer comunidade.

Para contribuir, clone o repositório e siga as instruções acima:

```bash
git clone <URL-DO-REPOSITÓRIO>
```
