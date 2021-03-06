var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

router.post("/Register", async(req, res, next) => {
    try {
        // parameters exists
        if (!(req.body.username && req.body.password &&
                req.body.firstname && req.body.lastname && req.body.country &&
                req.body.email && req.body.image_url))
            throw { status: 409, message: "At least one field is missing" };
        // valid parameters
        // username exists
        const users = await DButils.execQuery(
            "SELECT username FROM dbo.users"
        );

        if (users.find((x) => x.username === req.body.username))
            throw { status: 409, message: "Username taken" };

        //hash the password
        let hash_password = bcrypt.hashSync(
            req.body.password,
            parseInt(process.env.bcrypt_saltRounds)
        );
        req.body.password = hash_password;

        // add the new username
        await DButils.execQuery(
            `INSERT INTO dbo.users (username, password, fname, lname, country, email, pic) VALUES ('${req.body.username}', '${hash_password}','${req.body.firstname}', '${req.body.lastname}','${req.body.country}','${req.body.email}','${req.body.image_url}')`
        );
        // create favorites table

        res.status(201).send("user created");
    } catch (error) {
        next(error);
    }
});

router.post("/Login", async(req, res, next) => {
    try {
        const user = (
            await DButils.execQuery(
                `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
            )
        )[0];
        // user = user[0];
        console.log(user);

        // check that username exists & the password is correct
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            throw { status: 401, message: "Username or Password incorrect" };
        }

        // Set cookie
        req.session.user_id = user.user_id;
        // return cookie
        res.status(200).send("login succeeded");
    } catch (error) {
        next(error);
    }
});

router.post("/Logout", function(req, res) {
    req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
    res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;