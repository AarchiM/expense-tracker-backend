import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import incomeExpense from './router/IncomeExpenseRoutes.js'
import userRoute from './router/UsersRoute.js';

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;

app.get('/', (req, res) =>
{
    res.send("Hello World!!");
})

app.use('/api', incomeExpense);
app.use('/api', userRoute);

connectDB();
app.listen(port, () => console.log("Server is Running on PORT: ", port));