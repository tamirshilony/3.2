var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.use(async function(req, res, next) {
    // check if user is login
    if (!req.session.user_id) {
        res.status(401).send("Login is require");
    } else {
        next();
    }
});


module.exports = router;