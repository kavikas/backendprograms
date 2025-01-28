const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var express = require("express");
const app = express();
const cors=require('cors');//cors for resolving the error
//middleware
const authMiddleware=require("./middlewares/auth");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://kavikas2023cce:kavikas73@cluster0.4yzexas.mongodb.net/expense").then(() => {
    console.log("connected to databse");
});
const userSchema=new mongoose.Schema({
    id:String,
    name:String,
    email:String,
    password:String,
})
const User=mongoose.model("User",userSchema);
app.post("/signup",async(req,res)=>{

    const { name,email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Email already exist"});
        }
        const hashedPassword =await bcrypt.hash(password,10);
        const newUser=new User({
            id:uuidv4(),
            email,
            name,
            password:hashedPassword,
        })
        await newUser.save();
        res.json({message:"User Created succesfully"});

    }catch(error){
        
        res.status(500).json({message:"Internal server error"});
    }

});
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:" invalid email"});
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword){
        return res.status(400).json({message:"Invalid password"});
        }
        const token=jwt.sign({id:user.id},"secret_key",{expiresIn:"1h"});
        res.status(200).json(token)

    }
    catch(error){
        
        return res.status(500).json({message:"Internal server error"});
    }
})



const expenseSchema = new mongoose.Schema({
    id: { type: String, require: true, unique: true },//this is used for each id should be unique. if i creade same id mongodb will show an error
    titile: { type: String, require: true }, //required true is usedn for  that feel be must
    amount: { type: Number, require: true }
});
const Expenses = mongoose.model("Expenses", expenseSchema);
app.get("/api/expenses",async (req, res) => {
    console.log(req.user)
    try {
        const expenses = await Expenses.find();
        res.status(200).json(expenses);
    } catch (error) {
        onsole.log(error);
        res.status(500).json({ message: "failed in fetch expenses" });
    }

});
app.get("/api/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params
        const expenses = await Expenses.findOne({ id });
        if (!expenses) {
            return res.status(404).json({ message: "expense not found" });
        }

        res.status(200).json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: "error is fetching the message" });
    }
});
app.post("/api/expenses", async (req, res) => {
    console.log(req.body)
    const { title, amount } = req.body
    try {
        const newExpense = new Expenses({
            id: uuidv4(),
            title: title,
            amount: amount,
        });

        const savedExpense = await newExpense.save()
        res.status(200).json(savedExpense);
    }
    catch (err) {
        res.status(500).json({ message: "error in creating expense" });
    }

});
app.put("/api/expenses/:id", async (req, res) => {
    const { id } = req.params
    const { title, amount } = req.body;
    try {
        const updateExpense = await Expenses.findOneAndUpdate(
            { id },
            { title, amount },
        )
        if (!updateExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ title, amount });
    }
    catch (error) {
        res.status(500).json({ message: "updating expenses" })
    }
});
app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params
    try {
        const deleteExpense = await Expenses.findOneAndDelete(
            { id }
        );
        if (!deleteExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "deleting expenses" });
    }
    catch (error) {
        res.status(500).json({ message: " error in deleting expenses" })
    }
});

/*
app.get("/api/sayhello",(req,res)=>{
    res.send("Hello cce");
    res.end();
});
app.get("/api/students",(req,res)=>{
    res.status(200).json({name:"kaavi",age:18});
});*/
app.listen(3000, () => {
    console.log("Server is running on  port 3000");
})