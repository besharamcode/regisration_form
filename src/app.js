// GLOBEL REQUIERING
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')

// RELATIVE REQUIERING
const mongodb = require('./databse/connection')
const BookBesharam = require('./databse/models/regSchema');
const auth = require('./middleware/auth')
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
app.use(cookieParser())
hbs.registerPartials(partialsPath)


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/secrete', auth, (req, res) => {
    // console.log(req.cookies.jwt)
    res.render('secrete')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/registration', (req, res) => {
    res.render('registration')
})

app.get('/logout', auth, async (req, res) => {
    res.clearCookie('jwt')

    req.user.tokens = req.user.tokens.filter((curElem)=>{
        return curElem.token !== req.token
    })
    // console.log(req.user)
    await req.user.save()
    res.render('login')
})

app.get('/logoutall', auth, async (req, res) => {
    req.user.tokens = []
    res.clearCookie('jwt')
    await req.user.save()
    res.render('login')
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

            res.cookie("jwt", token, {
                expires : new Date(Date.now() + 30000)
            })

            let save = await saveDetails.save()
            // console.log(save)
            res.render('index')
        }
        
    } catch (error) {
        res.send( error + 'Enter correct details')
    }

})

app.post('/login', async (req, res) => {

    try {
        const enterEmail = req.body.email
        const enterPassword = req.body.password
    
        const userDetails = await BookBesharam.findOne({email:enterEmail})
        // console.log(userDetails.password)
        
        const isMatch = await bcrypt.compare(enterPassword, userDetails.password)
    
        const token = await userDetails.genAuthToken();
        // console.log(token)
    
        res.cookie("jwt", token, {
            expires : new Date(Date.now() + 30000),
            httpOnly :true,
            // secure:true
        })
    
        if(isMatch){
                res.render('index')
        }
        else{
            res.send("Incorecct user details")
        }
    } catch (error) {
        res.send("You are look like new please register")
    }
   
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
