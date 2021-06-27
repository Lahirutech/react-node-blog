const passport = require("passport");

const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRoleAdmin = (req, res, next) =>
    !(req.user.role === 'admin')
        ? res.status(403).json({ message: { msgBody: "You're not an admin,go away", msgError: true } })
        : next();

const checkRoleAdvertiser = (req, res, next) =>
        !(req.user.role === 'user')
            ? res.status(403).json({ message: { msgBody: "You're not a user away", msgError: true } })
            : next();        
//to define roles like[admin,user]
const checkRole = roles => (req, res, next) =>
    !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized")
        : next();

module.exports = { userAuth, checkRoleAdmin, checkRoleAdvertiser,checkRole };