import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Payments() {
  const [input, setInput] = useState({
    document: "",
    amount: "",
    type: "egreso",
  });
  const { push } = useHistory();

  const array = [
    { title: "Servicio de Internet", amount: "1120" },
    { title: "Cuota de Tarjeta de Credito", amount: "210" },
    { title: "Gastos administrativos", amount: "40" },
    { title: "Subscripcion revista Cientifica", amount: "140" },
    { title: "Seguro automotriz", amount: "2100" },
  ];

  const handleClick = (pay) => {
    if (input.document === "") {
      alert("Debes poner tu numero de documento");
    } else {
      axios
        .put(`http://localhost:3000/user/paytoken`)
        .then((data) => {
          push({
            pathname: "/main/tokenvalidate",
            state: {
              document: input.document,
              amount: pay,
              type: input.type,
            },
          });
        })
        .catch((error) => {
          alert(error);
        });
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
      <h1>Numero de Documento:</h1>
      <input
        name="document"
        onChange={handleChange}
        value={input.document}
        type="text"
        placeholder="Ingrese su documento"
      />
      <div>
        {array.map((pay) => {
          return (
            <div>
              <h4>{pay.title}</h4>
              <h4>Precio: {pay.amount}</h4>
              <button onClick={() => handleClick(pay.amount)}>Pagar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
