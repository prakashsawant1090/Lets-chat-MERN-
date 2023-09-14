// the authMiddleware.js file on your backend, particularly at line 29, where the error seems to originate.This is where the backend checks for the presence and validity of the token.Make sure this middleware is correctly implemented and used in the relevant routes.
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {

            // const authenticateToken = async (req, res, next) => {
            // token = req.header('Authorization');
            token = req.headers.authorization.split(" ")[1];

            //decodes token id
            const decoded = jwt.verify(token, `prakash`);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(402);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

});

module.exports = { protect };