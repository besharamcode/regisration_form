const jwt = require('jsonwebtoken');
const BookBesharam = require('../databse/models/regSchema')

const auth = async (req, res,next) =>{
    try {
        const token = req.cookies.jwt
        const userToken = await jwt.verify(token, process.env.SECRATE_KEY)
        // console.log(` i am user token  ${userToken}`)
        const user = await BookBesharam.findOne({_id:userToken})
        // console.log(` i am check user id  ${user}`)
        req.user = user
        req.token = token
        next();
    } catch (error) {
        res.send("you are new Please Register")
    }
}

module.exports = auth
