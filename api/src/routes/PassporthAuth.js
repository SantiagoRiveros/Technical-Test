require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const localPassport = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const { User } = require("../db.js");
const crypto = require("crypto");

const SECRET = process.env.SECRET || "secret";

passport.use(
  "login",
  new localPassport(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      User.findOne({ where: { email } })
        .then((user) => {
          if (!user) {
            console.log("NO HAY USUARIO");
            return done(null, false, {
              message: "Usuario no encontrado o inexistente.",
            });
          }
          if (!user.correctPassword(password)) {
            console.log("CONTRASEÑA EQUIVOCADA");
            return done(null, false, { message: "Contraseña invalida" });
          }
          console.log("TODO OK");
          return done(null, user, { message: "Bienvenido de nuevo" });
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.document); // A este done se le pasa el null porque no hubo errores y luego el ID para serializar
});

passport.deserializeUser(function (document, done) {
  User.findOne({ where: { document: document } }).then((user) => {
    const userInfo = {
      username: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
    };
    done(null, userInfo);
  });
});

passport.use(
  new BearerStrategy((token, done) => {
    jwt.verify(token, SECRET, function (err, user) {
      if (err) return done(err);
      return done(null, user ? user : false);
    });
  })
);

module.exports = passport;
