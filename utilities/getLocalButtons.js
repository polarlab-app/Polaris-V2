const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (exceptions = []) => {
  let localButtons = [];
  // Get all button categories
  const buttonCategories = getAllFiles(
    path.join(__dirname, "..", "buttons"),
    true
  );

  for (const buttonCategory of buttonCategories) {
    // Get all button files in the category
    const buttonFiles = getAllFiles(buttonCategory);

    for (const buttonFile of buttonFiles) {
      // Require the button object from the file
      const buttonObject = require(buttonFile);

      if (exceptions.includes(buttonObject.name)) {
        continue;
      }

      // Add the button object to the localButtons array
      localButtons.push(buttonObject);
    }
  }

  return localButtons;
};
