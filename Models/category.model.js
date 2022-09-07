const mongoose= require('mongoose')
const Schema=mongoose.Schema

const CategorySchema=new Schema({
    type:{
        type:String,
        require:true,
        enum: ['EXPENSE','INCOME'],
        default:'EXPENSE'
    },
    name:{
        type:String,
        require:true
    },
    icon:{
        type:String,
        ref:'Icon'
    },
    wallet:{
        type: Schema.Types.ObjectId,
        ref:"Wallet"
    }
},{timestamps: true})



module.exports=mongoose.model('Category',CategorySchema)