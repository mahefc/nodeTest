const connectToDB = require('../config/db');
const cName = "items";

async function getNextId(field) {
    const { collection } = await connectToDB("counter");
    const item = await collection.findOne({field});
    let count = item?.counter || 1;
    if(item){
        count++
        collection.updateOne({field},{ $set: {counter:count} } ,{upsert:true})
    }else{
        collection.insertOne({field,counter:count})
    }
    return count
}

module.exports = {
    getAllItems: async (req, res) => {
        try {
            const { client, collection } = await connectToDB(cName);
            const items = await collection.find({}).toArray();
            client.close();
            return res.json(items);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to read items' });
        }
    },
    createItem: async (req,res) => {
        try {
            const { client, collection } = await connectToDB(cName);
            // req.body.id = await getNextId("items");
            const result = await collection.insertOne(req.body,{ });
            client.close();
            return res.status(201).json(result);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to create item' });
        }
    },
    updateItem: async (req,res) => {
        try{
            const { client, collection , ObjectId } = await connectToDB(cName); 
            const id = new ObjectId(req?.body?._id);
            delete req.body._id
            const result = await collection.updateOne( { _id:id  }, { $set: req.body });
            client.close();
            return res.json(result);
        }
        catch(error){
            return res.status(500).json(error);
        }
    },
    clearAllItems: async (req,res) => {
        try {
            const { client, collection } = await connectToDB(cName);
            const result = await collection.deleteMany({}); 
            client.close();
            return res.json(result);
          } catch (err) {
            return res.status(500).json({ error: 'Failed to read items' });
        }
    }
}