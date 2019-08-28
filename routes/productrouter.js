var express=require("express");
var mongoose = require("mongoose");
var path=require('path');
var bodyparser = require("body-parser");
var url="mongodb://localhost/sampledb";

var product=require("../model/productmodel");

const router=express.Router();
router.use(bodyparser.urlencoded({extended:true}))

var multer=require("multer");

var storage =   multer.diskStorage({  
    destination: (req, file, callback)=>{  
      callback(null, path.join(__dirname,'/image/'));  
    },  
    filename: (req, file, callback)=>{  
      callback(null, file.originalname);  
    }  
}); 

var upload=multer({storage:storage})
var type=upload.single('file1');

mongoose.connect(url,function(err)
{
    if(err)
    throw err;
    else
        console.log("DB Connected!");
})

router.get("/",function(req,res)
{
    res.render("product");
})

// router.get("/product",function(req,res)
// {
//     res.redirect("/product")
// })

router.get("/view/:image",function(req,res){
    res.sendFile(__dirname+'/image/'+req.params.image)
})


router.post('/upload',type,function(req,res)
{
    var p1 = new product();
    p1.pid = req.body.pid;
    p1.pname = req.body.pname;
    p1.brand = req.body.brand;
    p1.size = req.body.size;
    p1.price = req.body.price;
    p1.qty = req.body.qty;
    p1.image = req.file.filename;
    p1.save((err)=>{
        if (err) throw err;
        else
        {
            console.log("Product Added.");
            res.redirect("/product");
        }
    })
})

router.get("/view",function(req,res){
    product.find({},function(err,result){
        if (err) throw err;
        else{
            console.log(result)
            res.render("productdetails",{productoutput:result});
        }
    })
    
})



module.exports=router;