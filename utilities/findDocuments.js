module.exports = async (key, collectionName, polaris) => {
    let connection = await polaris.dbPool.getConnection();
    let soda = await connection.getSodaDatabase();
    let collection = await soda.openCollection(collectionName);

    const filter = {"id": key}
    const documents = await collection.find().filter(filter).getDocuments();
    for(const document of documents) {
        return document;
    }
}