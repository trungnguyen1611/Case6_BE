let express = require('express'),
    router = express.Router();
let iconController = require('../Controllers/currency.controller');

router.get('',iconController.getAll)

module.exports = router;