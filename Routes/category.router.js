let express = require('express'),
    router = express.Router();
let categoryController = require('../Controllers/category.controller');
const verifyToken = require("../Middleware/auth.middleware");




router.route('/')
    .post(verifyToken,categoryController.showListCategory);

router.route('/add')
    .post(verifyToken,categoryController.addCategory);

router.route('/add-category-default')
    .post(verifyToken,categoryController.addCategoryDefaultOfWallet);

router.route('/update')
    .put(verifyToken,categoryController.updateCategory);

router.route('/delete')
    .post(verifyToken,categoryController.deleteCategory);

router.route('/expense')
    .post(categoryController.listExpense);

router.route('/income')
    .post(categoryController.listIncome);

module.exports = router;