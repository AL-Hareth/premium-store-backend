const { Storage } = require("megajs");

const storage = new Storage({
    email: process.env.MEGA_EMAIL,
    password: process.env.MEGA_PASSWORD
});

module.exports = storage;
