var express=require('express');
var path=require('path');
var app=express();
var mongoose=require('mongoose');

//mongo ds016098.mlab.com:16098/hb4class -u user -p password
mongoose.connect(process.env.MONGO_DB);//mongodb://user:password@ds016098.mlab.com:16098/hb4class
var db=mongoose.connection;
db.once('open',function(){
  console.log('db connected!');
});
db.on('error',function(err){
  console.log('db err:',err);
});

var dataSchema=mongoose.Schema({
  name:String,
  count:Number
});
var Data=mongoose.model('data',dataSchema);
Data.findOne({name:"myData"},function(err,data){
  if(err) return console.log("data err:",err);
  if(!data){
    Data.create({name:"myData",count:0},function(err,data){
      if(err) return console.log("data err:"+err);
      console.log("counter initialized:",data);
    });
  }
  console.log("mongo findOne end");
});

app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname,'public')));

// var data={count:0};
app.get('/',function(req,res){
  // data.count++;
  // res.render('my_first_ejs',data);
  Data.findOne({name:"myData"},function(err,data){
    if(err) return console.log("data err:",err);
    data.count++;
    data.save(function(err){
          if(err) return console.log("data err:"+err);
          res.render('my_first_ejs',data);
    });

    console.log("/ Data findOne end");
  });
});
app.get('/reset',function(req,res){
  data.count=0;
  res.render('my_first_ejs',data);
});
app.get('/set/count',function(req,res){
  if(req.query.count) data.count=req.query.count;
  res.render('my_first_ejs',data);
});
app.get('/set/:num',function(req,res){
  data.count=req.params.num;
  res.render('my_first_ejs',data);
  if(req.params.num) setCounter(res,req.params.num);
  else {
    getCounter(res);
  }
});

function setCounter(res,num){
  Data.findOne({name:"myData"},function(err,data){
    if(err) return console.log("data err:",err);
    data.count=num;
    data.save(function(err){
          if(err) return console.log("data err:"+err);
          res.render('my_first_ejs',data);
    });
  });
}

function getCounter(res){
  Data.findOne({name:"myData"},function(err,data){
    if(err) return console.log("data err:",err);
    res.render('my_first_ejs',data);
  });
}


app.listen(3000,function(){
  console.log(__dirname);
  console.log('server on');
});
