const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const { isValid, authenticatedUser } = require('./router/auth_users.js');

const app = express();

app.use(express.json());

app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware to authenticate requests to "/customer/auth/*" endpoint
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, "your_jwt_secret_key", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));