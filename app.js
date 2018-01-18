const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')
const url = require('url');

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}


let uuid2 = ()=>{
  let returnUUID = uuid();
  while(true){
    if(collection.filter(x=>x.id===returnUUID).length===0)
    {
      return returnUUID;
    }
    returnUUID = uuid();
  }
}

let verifyInt = (x)=>x==parseInt(x)?parseInt(x):false;
const album = [];
const collection = [];
const whatWeAreCollecting = "ahdunnos";
//TODO:use closure to store the variable, pull everything into a function that allows this, call it from another link, eventually have it store anything with a function.


app.use(bodyParser.json());

app.get('/', (req,res)=>{
  return res.status(200).send(`<a href=${fullUrl(req)}/${whatWeAreCollecting}>Currently Collecting: ${whatWeAreCollecting}</a>`)
})

app.get(`/${whatWeAreCollecting}`, (req, res)=>{
  let limit = verifyInt(req.query.limit);
  if(!!limit)
  {
    return res.status(200).send(collection.slice(0,limit));
  }
  return res.status(200).send(collection);
})

app.get(`/${whatWeAreCollecting}/:id`, (req,res)=>{
  let charOut = collection.filter(x=>x.id===req.params.id)[0]
  if(charOut)
  {
    return res.status(200).send(charOut);
  }
  return res.status(404).send('no characters found matching parameters');
})

app.post(`/${whatWeAreCollecting}`, (req,res)=>{
  console.log(req.body);
  if(req.body.name && !collection.filter(x=>x.name===req.body.name)[0])
  {
    if(req.body.name.length>29)
    {
      return res.status(400).send('tl;dr');
    }
    let newmovie = {name:req.body.name, id:uuid2()};
    collection.push(newmovie);
    return res.status(201).send(newmovie);
  }
  return res.status(400).send('no name provided');
})

app.put(`/${whatWeAreCollecting}/:id`,(req,res)=>{
  let objOut = collection.filter(x=>x.id===req.params.id)[0];
  if(objOut)
  {
    objOut.name=req.body.name;
    return res.status(200).send(objOut);
  }
  return res.status(404).send(objOut);
})

app.delete(`/${whatWeAreCollecting}/:id`, (req,res)=>{
  let indexDelete = collection.findIndex(x=>x.id===req.params.id);
  let objDelete = collection[indexDelete];
  if(objDelete)
  {
    objDelete = [objDelete];
    collection.splice(indexDelete,1);
    return res.status(200).send(objDelete);
  }
  return res.status(404).send('characters not found');
})


app.use(bodyParser.json())
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Collection listening on: ${port}!`)
  })
}

module.exports = app
