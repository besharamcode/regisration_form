require('dotenv').config()
const mongoose = require('mongoose');
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_HOST, (err)=>{
    if(err){
        console.log(err)
    }
    console.log('Conected to databse...')
})