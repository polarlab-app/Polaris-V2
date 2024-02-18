module.exports = (description, props) => {
    const newDesc = description.replace(/{(\d+)}/g, function (match, number) {
        return typeof props[number] != 'undefined' ? props[number] : 'none';
    });
    return newDesc;
};
