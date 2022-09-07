let express = require('express'),
    router = express.Router();
let userController = require('../Controllers/user.controller');

router.post('',userController.deleteAccount)

module.exports = router;