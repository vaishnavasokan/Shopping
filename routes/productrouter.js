var express=require("express");
var mongoose = require("mongoose");
var path=require('path');
var bodyparser = require("body-parser");
var url="mongodb+srv://dinish:dinish@cluster0-llco8.mongodb.net/sampledb?retryWrites=true&w=majority";
var product=require("../model/productmodel");
var cart=require("../model/cartmodel")

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
            //console.log(result)
            res.render("productdetails",{productoutput:result});
        }
    })
})
router.get("/manage",function(req,res){
    product.find({},function(err,result){
        if (err) throw err;
        else{
            //console.log(result)
            res.render("manageproduct",{productoutput:result});
        }
    })
})

router.get("/deleteproduct/:rid",function(req,res){
    const productid=req.params.rid;
    product.remove({pid:productid},function(err,result){
        console.log(result);
        if (err) throw err;
        else{
            res.redirect("/product/manage");
        }
        });
})

router.get("/remove/:rid",function(req,res){
    const rid=req.params.rid;
    cart.remove({cartid:rid},function(err,result){
        if (err) throw err;
        else{
            res.redirect("/product/cart");
        }
        });
})
    
    router.get("/addtocart/:id",function(req,res){
        console.log(req.params.id);
        const id =req.params.id;
        product.findOne({_id:id}).then((item)=>{
            var c1=new cart();
            cart.find().count().then((count)=>{
              
                count++;
                
                c1.cartid=count;
                c1.pname=item.pname;
                c1.image=item.image;
                c1.price=item.price;
                c1.qty=1;
                c1.total=parseInt(c1.price)*parseInt(c1.qty);
                c1.save((err)=>{
                    if (err) throw err;
                    else
                    {
                        console.log("Product Added to cart.");
                        res.redirect("/product/cart");
                    }
                })
            });
        });
        
    })

    router.get("/cart",function(req,res){
        cart.find({},function(err,result){
            if (err) throw err;
            else{
                console.log(result)
                res.render("viewcart",{cartoutput:result});
            }
        })  
    })


module.exports=router;