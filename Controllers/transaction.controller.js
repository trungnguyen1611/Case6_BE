const Transaction = require('../Models/transaction.model')
const Icon = require('../Models/icon.model');
const Category = require('../Models/category.model')
const asyncWrapper = require("../Middleware/async");
const mongoose = require("mongoose");
const {sendMail} = require('../utils/mailer')
const htmlContent = require('../utils/emailContent')



module.exports = {
    addTransaction: asyncWrapper(async (req, res, next) => {

        const transaction = new Transaction({
            wallet: req.body.wallet,
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date,
            note: req.body.note,
            user: req.body.user
        })
        await transaction.save((err,savedData) => {
            if (err) {
                throw err
            }

            if (req.body?.user?.email){
                console.log({savedData});
                sendMail(req.body?.user?.email,"Aloha Transaction Notification", htmlContent.htmlEmailTransaction(req.body,savedData))
            }
            res.status(200).json({success: true, data: transaction})
        })
    }),
    listTransactionWallet: asyncWrapper(async (req, res, next) => {
        const transaction = await Transaction.find({
            user: req.body.user,
            wallet: req.body.wallet
        }).populate([{path: 'category'},
            {
                path: 'wallet',
                populate: [{path: 'icon'}, {path: 'currency'}]
            }
        ]).sort({date: -1})
        res.json({success: true, data: transaction})
    }),
    listTransactionUser: asyncWrapper(async (req, res, next) => {
        const list = await Transaction.find({user: req.body.user})
            .populate([{path: 'category'},
                {
                    path: 'wallet',
                    populate: [{path: 'icon'}, {path: 'currency'}]
                }
            ]).sort({date: -1})
        res.json({success: true, data: list})
    }),
    listCategory: asyncWrapper(async (req, res, next) => {
        const category = await Category.find();
        res.json({success: true, data: category})
    }),
    listExpense: asyncWrapper(async (req, res, nex) => {
        const category = await Category.find({type: 'EXPENSE'})
        res.json({success: true, data: category})
    }),
    listIncome:asyncWrapper( async (req, res, next) => {
        const category = await Category.find({type: 'INCOME'})
        res.json({success: true, data: category})
    }),
    editTransaction: asyncWrapper(async (req, res, next) => {
        const transaction = {
            _id: req.body.id,
            wallet: req.body.wallet,
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date,
            note: req.body.note,
            user: req.body.user
        }
        await Transaction.findOneAndUpdate({_id: req.body.id}, transaction)
        res.json({success: true, data: transaction, msg: "Successfully Edit Transaction"})
    }),
    deleteTransaction: asyncWrapper(async (req, res, next) => {
        await Transaction.deleteOne({_id: req.body.id})
        res.json({success: true, msg: "Successfully Delete Transaction"})
    }),
    sortTransactionByCategory: asyncWrapper(async (req, res, next) => {
        const result = await Transaction
            .aggregate()
            .lookup({
                from:'category',
                localField:'category._id',
                foreignField:'_id',
                as:'asdasd'
            })
            .group({_id: '$category'})

        res.json({success: true, data: result})
    }),
    searchTransaction: asyncWrapper(async (req, res, nex) => {
        let search = {user: req.body.userId,}
        req.body?.wallet && (search.wallet = req.body.wallet)
        req.body?.category?._id && (search.category = req.body.category)
        req.body?.note && (search.note = new RegExp(req.body.note, 'ig'))
        req.body?.date && (search.date = {
            $gte: new Date(req.body.date.split("->")[0]),
            $lt: new Date(new Date(req.body.date.split('->')[1]).getTime() + (24 * 3600 * 1000))
        })
        const userTransResult = await Transaction
            .find(search)
            .populate([
                {path: 'category'},
                {
                    path: 'wallet', populate: [{path: 'icon'}, {path: 'currency'}]
}])
            .sort({date: -1})

        res.json({success: true, data: userTransResult})
    }),

    getReportData: asyncWrapper(async (req, res, next) => {
        let bodyDate = new Date(req.body.date)
        bodyDate.setMonth(bodyDate.getMonth() + 1, 1);
        let endDate = new Date(bodyDate)
        const data = await Transaction
            .aggregate([
                {$match:
                        {$and:[
                    {wallet: new mongoose.Types.ObjectId(req.body.currentWallet)},
                                { date: {
                                        $gte: new Date(req.body.date),
                                        $lt: new Date(endDate)
                                    }
                                }]}
                        },
                ])
            .facet({
                rawChartData: [{
                    $group: {
                        _id: {"date": "$date", "category": "$category.type"},
                        total: {$sum: "$amount"},
                    }
                },],
                rawDataPieChart: [{
                    $group: {
                        _id: {"name": "$category.name", "category": "$category.type"},
                        total: {$sum: "$amount"},
                    }
                },]
            })

        let transactionData = []
        data[0].rawChartData.forEach((eachResult, index) => {
            let checkingDateIndex = transactionData.findIndex(item => item?.XAxis === eachResult._id.date.toLocaleDateString());
            if (checkingDateIndex === -1) {
                transactionData.push({
                    XAxis: eachResult._id.date.toLocaleDateString(),
                    [eachResult._id.category]: eachResult.total
                })
            } else {
                transactionData[checkingDateIndex] = {
                    ...transactionData[checkingDateIndex],
                    [eachResult._id.category]: eachResult.total
                }
            }
        })
        transactionData.sort((a, b) => new Date(a.XAxis) - new Date(b.XAxis));

        let rawDataPieChartExpense = data[0].rawDataPieChart.filter((data => data._id.category === "EXPENSE"))
        let dataPieChartExpense = []
        rawDataPieChartExpense.forEach(item => dataPieChartExpense.push({...item._id, value: item.total}))
        let rawDataPieChartIncome = data[0].rawDataPieChart.filter((data => data._id.category === "INCOME"))
        let dataPieChartIncome = []
        rawDataPieChartIncome.forEach(item => dataPieChartIncome.push({...item._id, value: item.total}))


        res.json({success: true, transactionData, dataPieChartIncome, dataPieChartExpense})
    })

}



