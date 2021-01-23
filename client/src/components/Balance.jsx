import axios from "axios";
import React, { useState } from "react";

export default function Balance() {
  const [input, setInput] = useState({
    document: "",
    phone: "",
    amount: 0,
  });
  const [active, setActive] = useState(false);

  const handleRequest = () => {
    if (input.document === "" || input.phone === "") {
      alert("Debes completar todos los campos");
    } else {
      axios
        .get(
          `http://localhost:3000/user/balance?document=${input.document}&phone=${input.phone}`,
          input
        )
        .then((data) => {
          console.log(data.data.account.balance);
          setInput({ amount: data.data.account.balance });
          setActive(!active);
        })
        .catch((error) => {
          console.log("nose que le pinta");
          alert("Alguno de los datos es invalido");
        });
    }
  };

  const handleRestart = () => {
    setInput({
      document: "",
      phone: "",
      amount: 0,
    });
    setActive(!active);
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div>
        <h1>Debe ingresar su documento y telefono</h1>
        <h1>para poder acceder a su saldo</h1>
      </div>
      {!active ? (
        <div>
          <h2>Numero de Documento:</h2>
          <input
            name="document"
            onChange={handleChange}
            value={input.document}
            type="text"
            placeholder="Ingrese su Documento"
          />
          <h2>Numero de Telefono:</h2>
          <input
            name="phone"
            onChange={handleChange}
            value={input.phone}
            type="text"
            placeholder="Ingrese su Telefono"
          />
          <button onClick={() => handleRequest()}>Consultar Saldo</button>
        </div>
      ) : (
        <div>
          <h2>Su saldo es: ${input.amount}</h2>
          <button onClick={() => handleRestart()}>Reiniciar</button>
        </div>
      )}
    </div>
  );
}
