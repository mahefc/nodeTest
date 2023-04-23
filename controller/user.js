const connectToDB = require('../config/db');
const service = require('../service/common');
const cName = "users";

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const { client, collection } = await connectToDB(cName);
            const items = await collection.find({}).toArray();
            client.close();
            return res.status(200).json({items});
        } catch (err) {
            return res.status(500).json({msg:'Failed to get users'});
        }
    },
    getUserById: async (req, res) => {
        try {
            const { client, collection , ObjectId } = await connectToDB(cName); 
            const id = new ObjectId(req.params.id);
            const items = await collection.findOne({_id:id});
            client.close();
            return res.status(200).json({items});
        } catch (err) {
            return res.status(500).json({msg:'Failed to get user'});        }
    },
    registerUser: async (req,res) => {
        try {
            const { client, collection } = await connectToDB(cName);
            const body = req.body;
            if(body.password){
                body.password = await service.genPassword(body.password)
            }
            const result = await collection.insertOne(body);
            client.close();
            return res.status(200).json({...result});

        } catch (err) {
            return res.status(500).json({msg:'Failed to create user'});
        }
    },
    loginUser: async (req,res) => {
        const { client, collection } = await connectToDB(cName);
        const { username, password } = req.body;
        try{
            const user = await collection.findOne({username});
            client.close();
            const validPwd = await service.validatePwd(password,user.password)
            if(validPwd){
                const token = await service.genToken(user)
                return res.status(200).json({token});
            }else{
                return res.status(401).json({msg:'Password is not valid'});
            }
        } catch{
            return res.status(401).json({msg:'Username is not valid'});
        }
    }


}