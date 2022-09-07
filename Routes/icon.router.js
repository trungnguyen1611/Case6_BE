let express = require('express'),
    router = express.Router();
let iconController = require('../Controllers/icon.controller');

router.post('/add',iconController.add)
router.get('',iconController.getAll)

module.exports = router;