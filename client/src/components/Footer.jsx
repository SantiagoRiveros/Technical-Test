import React from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
//onClick={() => push("/main/balance")}
export default function Footer({ setLocalUser }) {
  const { push } = useHistory();

  const handleLogout = () => {
    setLocalUser(null);
    push("/");
  };

  return (
    <div>
      <Link to="/main/balance">SALDO</Link>
      <Link to="/main/recharge">RECARGA</Link>
      <Link to="/main/payments">PAGO</Link>
      <button onClick={() => handleLogout()}>LOGOUT</button>
    </div>
  );
}
