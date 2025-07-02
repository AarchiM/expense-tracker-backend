import { Router } from 'express';
import Income_Expenses from '../models/IncomeExpenseApi.js';
import {body, validationResult} from 'express-validator'

const routes = Router();

routes.post('/addIncome', async (req, res) => {
     try {
         const userExist = await Income_Expenses.findOne({ email: req.body.email });
         const transactionDetail = {
            TransactionSource: req.body.IncomeSource,
            TransactionAmount: req.body.IncomeAmount,
            TransactionType: "income"
        }
         if (userExist)
         {
            userExist.transaction.push(transactionDetail);
            await userExist.save();
            res.status(200).json({ message: "Income added to existing user." });
         }
         else {
             const newUser = new Income_Expenses({
                 email: req.body.email,
                 transaction: [transactionDetail]
             });

             await newUser.save();
             res.status(201).json({ message: "New user created and income added." });
         }
         
     } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({ error: "Internal server error" });
     }
})

routes.post('/addExpense', async (req, res) =>
{
    try {
        const userExist = await Income_Expenses.findOne({ email: req.body.email });
        const transactionDetail = {
            TransactionSource: req.body.ExpenseSource,
            TransactionAmount: req.body.ExpenseAmount,
            TransactionType: "expense"
        }
        if (userExist)
        {
            userExist.transaction.push(transactionDetail);
            await userExist.save();
            res.status(200).json({message: "Expense added to existing user."})
        } else
        {
            const newUser = new Income_Expenses({
                email: req.body.email,
                transaction: [transactionDetail],
            })

            await newUser.save();
            res.status(200).json({message: "New user created and expense added."})

        }
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({ error: "Internal server error" });
    }
})

routes.post('/usersData', [
    body('email').isEmail().withMessage("Please Enter Correct Email!!")
  ], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
  
    const { email } = req.body;
  
    try {
      const data = await Income_Expenses.findOne({ email });
      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(data);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

routes.post('/userInfo', async (req, res) =>
{
    const { email } = req.body;
    try {
        const data = await Income_Expenses.findOne({ email });
        if (!data) {
            return res.json({totalIncome :0, totalExpense: 0, totalBalance: 0});;
        }
        const totalIncome = (data??[]).transaction.reduce((acc, amount) => {return amount.TransactionType === 'income' ? acc + amount.TransactionAmount: acc + 0}, 0);
        const totalExpense = (data??[]).transaction.reduce((acc, amount) => {return amount.TransactionType === 'expense' ? acc + amount.TransactionAmount: acc+0}, 0);
        const totalBalance = totalIncome - totalExpense;
        
        res.json({totalIncome, totalExpense, totalBalance});
        
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

routes.post('/getAllTransaction', async (req, res) =>{
    const {email} = req.body;
    try {
        const data = await Income_Expenses.findOne({ email });
        if (!data) {
            return res.json([]);
        }

        return res.json(data.transaction);
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

export default routes;