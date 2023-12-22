const { colors } = require('../../data/consoleColors'); 

module.exports = async (polaris) => {
  const { Player } = require("discord-player");

  const player = new Player(polaris, {
    ytdlOptions: {
      quality: "highestaudio",
      filter: "audioonly",
    },
  });
  await player.extractors.loadDefault();
  console.log(colors.success + '[POLARIS STABLE] Polaris Success: Music Loaded')
};
