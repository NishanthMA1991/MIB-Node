const admin = require('express').Router();


admin.get("/deleteProducts", (req, res) => {
    res.status(200).json({ message: 'Inside The deleteProd routes' });
});

admin.get("/addProducts", (req, res) => {
    res.status(200).json({ message: 'Inside The addProducts routes' });
});

// register.get("/", (req, res) => {
//     res.status(200).json({ message: 'Inside The reg routes' });
// });

module.exports = admin;