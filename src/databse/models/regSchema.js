require('dotenv').config()
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const e = require('express');

const RegSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trime: true
    },
    lastName: {
        type: String,
        required: true,
        trime: true
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trime: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    conPassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

RegSchema.methods.genAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id }, process.env.SECRATE_KEY)
        this.tokens = this.tokens.concat({ token: token })
        const saveTokens = await this.save()
        // console.log(this.tokens)
        return token
    } catch (error) {
        console.log(error)
    }

}

RegSchema.pre("save", async function () {
    try {
        if (this.isModified("password")) {
            // console.log(await this.password)
            this.password = await bcryptjs.hash(this.password, 10)
            // console.log(await this.password)
            this.conPassword = await bcryptjs.hash(this.password, 10)
        }
    } catch (error) {
        res.send(error)
        // console.log(error)
    }
})

const BookBesharam = new mongoose.model('BookBesharam', RegSchema)

module.exports = BookBesharam;