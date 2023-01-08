// GLOBEL REQUIERING
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

// RELATIVE REQUIERING
const mongodb = require('./databse/connection')
const BookBesharam = require('./databse/models/regSchema');
// VARIABLES DECLERATION
const app = express()
const port = process.env.PORT || 1000

// EXPRESS RELATED

// PATHS
const staticPath = path.join(__dirname, '../public')
const templetsPath = path.join(__dirname, '../templets/views')
const partialsPath = path.join(__dirname, '../templets/partials')
// console.log(partialsPath)
// SETS
app.use(express.static(staticPath))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'hbs')
app.set('views', templetsPath)
hbs.registerPartials(partialsPath)


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/registration', (req, res) => {
    res.render('registration')
})

app.post('/registration', async (req, res) => {
    try {

        let password = req.body.password
        let conPassword = req.body.conPassword
        // console.log(password,conPassword)
        if (password === conPassword) {
            let saveDetails = new BookBesharam({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                gender: req.body.gender,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                conPassword: req.body.conPassword
            })

            const token = await saveDetails.genAuthToken();

            let save = await saveDetails.save()
            // console.log(save)
            res.render('index')
        }
        
    } catch (error) {
        res.send( error + 'Enter correct details')
    }

})

app.post('/login', async (req, res) => {
    const enterEmail = req.body.email
    const enterPassword = req.body.password

    const userDetails = await BookBesharam.findOne({email:enterEmail})
    // console.log(userDetails.password)
    const isMatch = await bcrypt.compare(enterPassword, userDetails.password)

    const token = await userDetails.genAuthToken();
    console.log(token)
    if(isMatch){
            res.render('index')
    }
    else{
        res.send("Incorecct user details")
    }
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


// const securepass = async (password)=>{
//   const hashpass = await bcryptjs.hash(password, 10)
//   console.log(hashpass)
//   const matchpass = await bcryptjs.compare(password,'bdfhd')
//   console.log(matchpass)
// }

// securepass("BesharamCode")

// const createToken = async ()=>{
//   const token = jwt.sign({ _id: '63b90cf98614216e580bdc2d' }, "123456789mnbvcxzasdfghjkl;qwertyuiop",{expiresIn:"2 seconds"})
//   console.log(token)

//   const tokenVar = jwt.verify(token, "123456789mnbvcxzasdfghjkl;qwertyuiop")
//   console.log(tokenVar)
// }

// createToken()