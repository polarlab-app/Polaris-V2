module.exports = (int) => {
    let hex = int.toString(16);
    while (hex.length < 6) {
        hex = '0' + hex;
    }
    return '#' + hex;
};
