'use strict'

const mongoose = require('mongoose');
const users = require('../models/Users');
const dotenv = require('dotenv');
const util = require('./utility');
dotenv.config();

main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    }
    catch(err) {
        console.error(err);
    }
}