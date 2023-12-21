module.exports = async (polaris) => {
  const { Player } = require("discord-player");

  const player = new Player(polaris, {
    ytdlOptions: {
      quality: "highestaudio",
      filter: "audioonly",
    },
  });
  await player.extractors.loadDefault();
};
