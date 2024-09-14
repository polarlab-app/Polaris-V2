module.exports = async (loot) => {
    let items = Object.keys(loot);

    let totalWeight = items.reduce((total, _, index) => total + 1 / (index + 1), 0);

    let randomNumber = Math.random() * totalWeight;

    let runningTotal = 0;
    for (let i = 0; i < items.length; i++) {
        runningTotal += 1 / (i + 1);
        if (randomNumber <= runningTotal) {
            return items[i];
        }
    }
};
