import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Recharge() {
  const [input, setInput] = useState({
    document: "",
    phone: "",
    amount: "",
    type: "ingreso",
  });
  const { push } = useHistory();

  const handleSubmit = () => {
    if (input.document === "" || input.phone === "" || input.amount === "") {
      alert("Todos los campos son necesarios");
    } else {
      axios
        .put(`http://localhost:3000/account/`, {
          document: input.document,
          phone: input.phone,
          amount: input.amount,
          type: input.type,
        })
        .then((data) => alert("Recarga realizada con exito"), push("/main"))
        .catch((error) => alert("Falla en la recarga"));
    }
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>RECARGA:</h1>
      <div>
        <div>
          <h1>Numero de Documento:</h1>
          <input
            name="document"
            onChange={handleChange}
            value={input.document}
            type="text"
            placeholder="Ingrese su documento"
          />
        </div>
        <div>
          <h1>Numero de Telefono Movil:</h1>
          <input
            name="phone"
            onChange={handleChange}
            value={input.phone}
            type="text"
            placeholder="Ingrese su telefono"
          />
        </div>
        <div>
          <h1>Monto a Recargar:</h1>
          <input
            name="amount"
            onChange={handleChange}
            value={input.amount}
            type="text"
            placeholder="Ingrese el monto"
          />
        </div>
      </div>
      <div>
        <button onClick={handleSubmit}>RECARGAR</button>
      </div>
    </div>
  );
}
