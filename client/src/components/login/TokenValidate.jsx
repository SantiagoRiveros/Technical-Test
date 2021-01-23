import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function TokenValidate(props) {
  const [input, setInput] = useState(0);
  console.log(props.location.state);
  const state = props.location.state;
  const { push } = useHistory();

  const handleRegister = () => {
    axios.get(`http://localhost:3000/user/${state.document}`).then((data) => {
      console.log(data);
      console.log(data.data.tokenNum);
      console.log(input);
      if (parseInt(input.token, 10) != data.data.tokenNum) {
        alert("El numero ingresado no coincide!");
      } else {
        axios.put(`http://localhost:3000/user/`, {
          email: state.email,
          password: state.password,
          document: state.document,
          firstName: state.firstName,
          lastName: state.lastName,
          phone: state.phone,
        });

        console.log("usuario creado con exito!");
        alert("Usuario creado con exito!");
        push("/");
      }
    });
  };

  const handlePayment = () => {
    axios.get(`http://localhost:3000/user/${state.document}`).then((data) => {
      console.log("data payment cheta", data);
      if (parseInt(input.token, 10) != data.data.tokenNum) {
        alert("El numero ingresado no coincide!");
      } else {
        if (data.data.account.balance < state.amount) {
          alert("Saldo insuficiente");
          push("/main");
        } else {
          axios
            .put(`http://localhost:3000/account/`, {
              document: state.document,
              amount: state.amount,
              type: "egreso",
            })
            .then((data) => alert("Pago realizado con exito"), push("/main"))
            .catch((error) => alert("Fallo en el pago"));
        }
      }
    });
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>INGRESE EL TOKEN ENVIADO A SU EMAIL:</h1>
      <div>
        <input
          name="token"
          type="text"
          onChange={handleChange}
          placeholder="Ingrese el Token"
        />
      </div>
      <div>
        {props.location.state.type === "register" ? (
          <button onClick={() => handleRegister()}>FINALIZAR REGISTRO</button>
        ) : props.location.state.type === "egreso" ? (
          <button onClick={() => handlePayment()}>FINALIZAR COMPRA</button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
