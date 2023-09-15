const express = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

const CompaniesDB = require("./modules/companiesDB.js");
const db = new CompaniesDB();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json()); 



app.get("/", (req,res) => {
    res.send({message:"API Listening"})
    //res.sendFile(path.join(__dirname, "/index.html"));
  });

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
  }).catch((err)=>{
  console.log(err);
  });


  app.get("/api/companies/", (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const tag = req.query.tag || null;
    db.getAllCompanies(page, perPage, tag).then((company) => {
    res.json(company); 
  }).catch((error) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  });
});


  app.post("/api/companies/:data", (req, res) => {
    db.addNewCompany(req.params.data).then((company) => {
      res.json(company); 
    }).catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' }); 
    });
});


  app.get("/api/company/:id", (req, res) => {
      db.getCompanyByName(req.params.id).then((company) => {
        res.json(company); 
      }).catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' }); 
      });
  });


  app.put("/api/company/:data/:id", (req, res) => {
    const data = req.query.data;
    const id = req.query.id;
    db.updateCompanyByName(data, id).then((company) => {
      res.json(company); 
    }).catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' }); 
    });
});
  

  app.delete("/api/company/:id", (req, res) => {
    db.deleteCompanyByName(req.params.id).then((company) => {
      res.json(company); 
    }).catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' }); 
    });
});
  
  


