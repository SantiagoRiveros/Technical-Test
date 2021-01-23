import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Login({ setLocalUser }) {
  const [input, setInput] = useState({ email: "", password: "" });
  const { push } = useHistory();
  console.log(setLocalUser);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = () => {
    if (input.email === "" || input.password === "") {
      alert("Completar todos los campos");
    } else {
      axios.post(`http://localhost:3000/user/login`, input).then((data) => {
        setLocalUser(data.data);
        alert("logueado!");
        console.log("estas logueado");
        console.log(data);
        setInput({ email: "", password: "" });
        push("/main");
      });
    }
  };

  return (
    <div>
      <div>
        <h1>EMAIL:</h1>
        <input
          name="email"
          onChange={handleChange}
          value={input.email}
          type="text"
          placeholder="Ingrese su email"
        />
      </div>
      <div>
        <h1>PASSWORD:</h1>
        <input
          name="password"
          onChange={handleChange}
          value={input.password}
          type="password"
          placeholder="Ingrese su password"
        />
      </div>
      <div>
        <button onClick={() => handleLogin()}>INGRESAR</button>
        <button onClick={() => push("/register")}>REGISTRO</button>
      </div>
    </div>
  );
}
