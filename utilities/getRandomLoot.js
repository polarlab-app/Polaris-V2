module.exports = (items) => {
    const totalWeight = Object.values(items).reduce((acc, weight) => acc + weight, 0);
    let randomWeight = Math.floor(Math.random() * totalWeight);
  
    for (const [itemName, itemWeight] of Object.entries(items)) {
      randomWeight -= itemWeight;
      if (randomWeight <= 0) {
        return itemName;
      }
    }
}