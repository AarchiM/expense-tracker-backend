import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import incomeExpense from './router/IncomeExpenseRoutes.js'
import userRoute from './router/UsersRoute.js';
import cors from "cors";

dotenv.config();
const app = express();
const corsOptions = {
  origin: process.env.ORIGIN,
  methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.use(cors(corsOptions));
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