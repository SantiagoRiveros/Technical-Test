import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    document: "",
    phone: "",
  });
  const { push } = useHistory();

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    if (
      input.email === "" ||
      input.password === "" ||
      input.firstName === "" ||
      input.lastName === "" ||
      input.document === "" ||
      input.phone === ""
    ) {
      alert("Debes llenar todos los campos");
    } else {
      axios
        .post(`http://localhost:3000/user/register`, {
          document: input.document,
          email: input.email,
        })
        .then((data) =>
          push({
            pathname: "/tokenvalidate",
            state: {
              email: input.email,
              password: input.password,
              firstName: input.firstName,
              lastName: input.lastName,
              document: input.document,
              phone: input.phone,
              type: "register",
            },
          })
        )
        .catch((error) => alert(error));
    }
  };

  return (
    <div>
      <h1>INGRESE SUS DATOS</h1>
      <div>
        <h1>EMAIL:</h1>
        <input
          name="email"
          onChange={handleChange}
          type="text"
          placeholder="Ingrese su email"
        />
      </div>
      <div>
        <h1>PASSWORD:</h1>
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Ingrese su password"
        />
      </div>
      <div>
        <h1>NOMBRE/S:</h1>
        <input
          name="firstName"
          onChange={handleChange}
          type="text"
          placeholder="Ingrese su nombre"
        />
      </div>
      <div>
        <h1>APELLIDO/S:</h1>
        <input
          name="lastName"
          onChange={handleChange}
          type="text"
          placeholder="Ingrese su apellido"
        />
      </div>
      <div>
        <h1>NUMERO DE DOCUMENTO:</h1>
        <input
          name="document"
          onChange={handleChange}
          type="text"
          placeholder="Ingrese su Documento"
        />
      </div>

      <div>
        <h1>NUMERO DE TELEFONO MOVIL:</h1>
        <input
          name="phone"
          onChange={handleChange}
          type="text"
          placeholder="Ingrese su telefono"
        />
      </div>
      <div>
        <button onClick={() => handleClick()}>REGISTRARSE</button>
      </div>
    </div>
  );
}
