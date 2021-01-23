const server = require("express").Router();
const { User, Account } = require("../db.js");

//creacion de la cuenta usando el id
server.post("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then((data) => {
      Account.create({ balance: 0, userId: userId });
      res.send(data.dataValues);
    })
    .catch((error) => res.send(error));
});

//cambiar el balance de la cuenta
server.put("/", (req, res, next) => {
  console.log(req.body);
  const document = req.body.document;
  const amount = req.body.amount;
  const type = req.body.type;
  User.findOne({
    where: { document: document },
    include: [{ model: Account }],
  }).then((data) => {
    var balance = 0;
    //aqui defino si le estoy recargando dinero a la cuenta, o gastando e influye en su balance
    if (type === "ingreso") {
      balance = parseInt(data.account.balance, 10) + parseInt(amount, 10);
    }
    if (type === "egreso") {
      balance = data.account.balance - amount;
    }
    const account = data.account;
    if (balance < 0) {
      res.json({ message: "Saldo insuficiente" });
    } else {
      account
        .update({ balance: balance })
        .then((data) => {
          res.send(data);
        })
        .catch((error) => {
          res.send(error);
        });
    }
  });
});

module.exports = server;
