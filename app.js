var express = require("express");
const app=express();
const path=require("path");

var userrouter = require("./routes/userrouter");
var productrouter = require("./routes/productrouter");

app.use("/user",userrouter);
app.use("/product",productrouter);

app.use(express.static(path.join(__dirname,"/public")));

app.listen(process.env.PORT || 8080,function(req,res)
{
    console.log("Server started.");
})

app.set("view engine", "ejs");
app.set("views","./src/view");

app.get("/",function(req,res)
{
    res.render("index");
})

app.get("/index",function(req,res)
{
    res.redirect("/");
})

app.get("/register",function(req,res)
{
    res.render("register");
})

// app.get("/addproduct",function(req,res)   //not needed
// {
//     res.render("product");
// })

// app.get("/productdetails",function(req,res)
// {
//     res.render("productdetails");
// })






