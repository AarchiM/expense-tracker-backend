import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    TransactionSource: {
        type: String,
        required: true,
    },
    TransactionAmount: {
        type: Number,
        required: true,
    },
    TransactionType: {
        type: String,
        required: true,
    }
},{ timestamps: true})

const UserDetailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    transaction: [transactionSchema]
}, {timestamps: true})

const Income_Expenses = mongoose.model("Income_Expenses", UserDetailSchema);

export default Income_Expenses;