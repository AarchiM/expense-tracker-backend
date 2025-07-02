import { Router } from "express";
import { body, validationResult } from 'express-validator';
import User from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const routes = Router();

routes.post('/signUp', [
    body('email').isEmail().withMessage("Please Enter Correct Email!!"),
    body('password').isLength({ min: 6 }).withMessage("Password must contain at least 6 characters!!"),
], async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password, name } = req.body;
    try
    {
        const existUser = await User.findOne({ email });
        if (existUser)
            {
                return res.status(200).json({ msg: "User Already Exist!!" });
            }
            const hashPass = await bcrypt.hash(password, 10)
            const newUser = new User({
                name, email, password: hashPass,
            })
        await newUser.save();

        const userExist = await User.findOne({ email });
        const token = jwt.sign({id: userExist._id}, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(201).json({ success: true, Authtoken: token, name });

    } catch (error)
    {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
});

routes.post('/login', [
    body('email').isEmail().withMessage("Please Enter Correct Email!!"),
], async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
        const userExist = await User.findOne({ email });
        if (!userExist)
        {
            return res.status(400).json({ success: false, msg: "User Not Found!!" });     
        }
        const passValidate = await bcrypt.compare(password, userExist.password);
        if (!passValidate)
        {
            return res.status(400).json({ success: false, msg: "Incorrect Password!!" });     
        }
        const token = jwt.sign({id: userExist._id}, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(201).json({ success: true, Authtoken: token, name: userExist.name });

    } catch (error) {
        
    }
})

export default routes;