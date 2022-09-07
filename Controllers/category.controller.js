const Category = require('../Models/category.model')
const asyncWrapper = require("../Middleware/async");
const arrCategoryDefault = require('../default.category')
module.exports = {
    showListCategory: asyncWrapper(async (req, res) => {
        const idWallet = req.body.idWallet;
        data = await Category.find({wallet: idWallet})
        res.status(200).json({success: true, data})
    }),
    listExpense: async (req, res, nex) => {
        const category = await Category.find({type: 'EXPENSE',wallet:req.body.wallet})
        res.json({success: true, data: category})
    },
    listIncome: async (req, res, next) => {
        const category = await Category.find({type: 'INCOME',wallet:req.body.wallet})
        res.json({success: true, data: category})
    },

    addCategory: async (req, res) => {
        const {type, name, icon,wallet} = req.body;

        if (type === '' || name === '' || icon === '')
            return res.status(400).json({success: false, message: 'invalid'})
        try {
            const newCategory = new Category({
                type,
                name,
                icon,
                wallet
            })
            await newCategory.save()
            data = await Category.find({wallet: wallet})
            res.status(200).json({success: true, message: 'them moi thanh cong', data})
        } catch (err) {
            console.log(err)
            res.status(401).json({success: false, message: 'them khong thanh cong'})
        }
    },

    updateCategory: async (req, res) => {
        const {id, type, name, icon,wallet} = req.body;
        console.log(req.body)
        if (!type || !name || !icon)
            return res.status(400).json({success: false, message: 'invalid'})
        try {
            await Category.updateOne({_id: id}, {
                type: type,
                name: name,
                icon: icon,
            })
            data = await Category.find({wallet: wallet})
            res.status(200).json({success: true, message: 'update thanh cong', data})
        } catch (err) {
            console.log(err)
            res.status(401).json({success: false, message: 'update khong thanh cong'})
        }
    },

    deleteCategory: async (req, res) => {
        const deleteId = req.body.id;
        const wallet = req.body.wallet
        console.log(deleteId)
        console.log(req.body)
        if (!deleteId)
            return res.status(400).json({succes: false, message: 'khong ton tai category'});
        try {
            await Category.findByIdAndRemove({_id: deleteId})
            data = await Category.find({wallet: wallet})
            res.status(200).json({success: true, message: 'xoa thanh cong', data})
        } catch (err) {
            console.log(err)
            res.status(401).json({success: false, message: 'xoa khong thanh cong'})
        }
    },

    addCategoryDefaultOfWallet: async (req, res) => {
        const idWallet = req.body.id
        try {
            for(let i= 0; i< arrCategoryDefault.length;i++){
                const newCategory = new Category({
                    type: arrCategoryDefault[i].type,
                    name: arrCategoryDefault[i].name,
                    icon: arrCategoryDefault[i].icon,
                    wallet: idWallet
                })
                await newCategory.save()
            }
            data = await Category.find()
            res.status(200).json({success: true, message: 'them catagory mac dinh vao vi moi thanh cong', data})
        }
        catch (err){
            console.log(err)
            res.status(401).json({success: false, message: 'them catagory mac dinh vao vi moi khong thanh cong'})
        }

    }


}