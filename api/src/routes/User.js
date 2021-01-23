require("dotenv").config();
require("./PassporthAuth");
const { User, Account } = require("../db");
const server = require("express").Router();
const passport = require("passport");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

server.use(passport.initialize()); //Arranca passport mediante middleware
server.use(passport.session());

const SECRET = process.env.SECRET || "secret";

//transporte para nodemailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, //Nuestro mail
    pass: process.env.PASSWORD, //Nuestra password
  },
});

//el mail en si
var returnHTML = function (tokenNumber) {
  return ` 
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            .container {
             width: 90%;
             margin: auto;
             border: solid 2px purple;
             border-radius: 50px  ;
            }
            h1 {
              text-align: center;
            }
            h2 {
              text-align: center;
            }
            ul {
              text-decoration: none
            }
          </style>
        </head>
      <body>
        <div class='container'>
          <h1>BIENVENIDO</h1>
          <h2>¡Espéremos disfrute esta web de prueba!</h2>
          <hr>
          
          <div>
            <h1>Su codigo para activar su cuenta es:</h1>
            <h1> ${tokenNumber} </h1>
          </div>
  
          
    </div> 
    </body> 
    </html>`;
};
var returnHTML2 = function (tokenNumber) {
  return ` 
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            .container {
             width: 90%;
             margin: auto;
             border: solid 2px purple;
             border-radius: 50px  ;
            }
            h1 {
              text-align: center;
            }
            h2 {
              text-align: center;
            }
            ul {
              text-decoration: none
            }
          </style>
        </head>
      <body>
        <div class='container'>
          <h1>Gracias por su pago</h1>
          <h2>¡Espéremos este disfrutando!</h2>
          <hr>
          
          <div>
            <h1>Su codigo para el pago es:</h1>
            <h1> ${tokenNumber} </h1>
          </div>
  
          
    </div> 
    </body> 
    </html>`;
};

//Aqui creo el usuario solo con el documento
//genero el token, y envio el email.
server.post("/register", (req, res, next) => {
  const document = req.body.document;
  const email = req.body.email;
  if (!document) {
    return res
      .status(400)
      .json({ message: "Parametros incompletos o invalidos" });
  }
  var tokenNumber = Math.ceil(Math.random() * 1000000);
  User.create({ document: document, tokenNum: tokenNumber })
    .then((u) => {
      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Codigo de activacion",
        html: returnHTML(tokenNumber),
      };
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error occurs: ", err);
        } else {
          console.log("Success");
        }
      });
      res.json({ message: "Revise su email!" });
    })
    .catch(next);
});

//consulta el saldo a partir del documento y telefono
server.get("/balance", (req, res, next) => {
  const document = req.query.document;
  const phone = req.query.phone;

  User.findOne({
    where: { document: document, phone: phone },
    include: [{ model: Account }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
});

//aqui traemos los datos del user a partir de su document
server.get("/:document", (req, res, next) => {
  const document = req.params.document;
  User.findOne({ where: { document: document }, include: [{ model: Account }] })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
});

//aqui actualizo el user con todos sus datos
server.put("/", (req, res, next) => {
  const document = req.body.document;
  User.findOne({ where: { document: document } })
    .then((data) => {
      data.update({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
      });
      Account.create({ balance: 0, userId: data.id });
      res.send(data);
    })
    .catch(next);
});

//Ruta para Login
server.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      return res.json({
        user: user.dataValues,
        token: jwt.sign(user.dataValues, SECRET),
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//actualizar el token, para el payment
server.put("/paytoken", (req, res, next) => {
  const document = req.user.document;
  User.findOne({ where: { document: document } }).then((data) => {
    var tokenNumber = Math.ceil(Math.random() * 1000000);

    const user = data.dataValues;

    data
      .update({ tokenNum: tokenNumber })
      .then((data) => {
        let mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "Codigo de confirmacion",
          html: returnHTML2(tokenNumber),
        };
        transporter.sendMail(mailOptions, function (err, data) {
          if (err) {
            console.log("Error occurs: ", err);
            res.send(err);
          } else {
            res.send(data);
            console.log("Success");
          }
        });
      })
      .catch(next);
  });
});

module.exports = server;
