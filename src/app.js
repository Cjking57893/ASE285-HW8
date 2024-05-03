'use strict'

const mongoose = require('mongoose');
const users = require('../models/Users');
const dotenv = require('dotenv');
const {readFile, writeFile, hash} = require('./utility');
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

async function login() {
    if (process.argv.length != 4) {
        mongoose.connection.close();
        return false;
    }

    const email = process.argv[2];
    const password = process.argv[3];

    let user = await users.findOne({email: email});
    if (user.password == hash(password)) {
        await mongoose.connection.close();
        return true;
    }
    else {
        await mongoose.connection.close();
        return false;
    }
}

if (require.main === module) {
    (async () => {
        console.log(await login())
    })();
}