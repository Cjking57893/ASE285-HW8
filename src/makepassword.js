'use strict'
const fs = require('fs');
const {readFile, writeFile, hash} = require('./utility')

function makepassword(passwordFileName, passwordEncFileName) {
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
    makepassword('./password.txt', './password.enc.txt')
}

module.exports = {makepassword};