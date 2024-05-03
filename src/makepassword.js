'use strict'
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('../models/Users')
const {readFile, writeFile, hash} = require('./utility');
dotenv.config();

async function makepassword(passwordFileName, passwordEncFileName) {
    const passwordFile = readFile(passwordFileName);

    const emails = passwordFile.map(line => {
        let email = line.split(':')[0];
        return email;
   });

    const passwords = passwordFile.map(line => {
        let password = line.split(':')[1];
        return hash(password);
    });

    const accounts = passwords.map((password, i) => {
        let account = emails[i] + ':' + password;
        return account;
    });

    writeFile(accounts, passwordEncFileName);
}

if (require.main === module) {
    (async () => {
        try {
            await makepassword('./password.txt', './password.enc.txt');

            let accounts = await readFile('./password.enc.txt'); // Await readFile

            await mongoose.connect(process.env.MONGO_URI);

            for (let account of accounts) { // Using for...of loop
                let [email, password] = account.split(':');

                let user = new users({
                    email: email,
                    password: password
                });

                await user.save();
            }

            await mongoose.connection.close();
            console.log("Added users from password.txt to database.");
        } catch (err) {
            console.error(err);
        }
    })();
}

module.exports = {makepassword};