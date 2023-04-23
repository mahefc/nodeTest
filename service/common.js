const bcrypt = require('bcrypt');
const { sign , verify } = require("jsonwebtoken");
var user = {};

module.exports = {
    genPassword: async (pwd) => {
        return bcrypt.hashSync(pwd,bcrypt.genSaltSync(10));
    },
    validatePwd: async (pwd,data)=> {
        return bcrypt.compare(pwd, data)
    },
    genToken: async (data) => {
        if(data.password){
            delete data.password
        }
        return sign({ ...data }, process.env.TOKEN_KEY, { expiresIn: "1d" });
    },
    verifyToken: (req,res,next) => {
        const token = req.headers['authorization'];
        if(!token){
            return res.status(401).json({msg:"Authentication Failed"})
        }else{
            verify(token, process.env.TOKEN_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({msg:"Authentication Failed"})
                } else {
                    delete decoded?.iat
                    delete decoded?.exp
                    Object.assign(user ,{...decoded});
                    next();
                }
            });
        }
    },
    getUser: () => {
        return user
    }
}


