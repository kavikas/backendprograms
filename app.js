const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var express = require("express");
const app = express();
//middleware
app.use(express.json());
mongoose.connect("mongodb+srv://kavikas2023cce:kavikas73@cluster0.4yzexas.mongodb.net/expense").then(() => {
    console.log("connected to databse");
});
const expenseSchema = new mongoose.Schema({
    id: { type: String, require: true, unique: true },//unique is used for each id should be unique. if i creade same id mongodb will show an error
    titile: { type: String, require: true }, //required true is usedn for  that feel be must
    amount: { type: Number, require: true }
});
const Expenses = mongoose.model("Expenses", expenseSchema);
app.get("/api/expenses", async (req, res) => {
    try {
        const expenses = await Expenses.find();
        res.status(200).json(expenses);
    } catch (error) {
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