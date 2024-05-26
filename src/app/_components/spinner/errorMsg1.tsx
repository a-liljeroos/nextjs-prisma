import React from "react";
import "./errorMsg.scss";

interface ErrorMsgProps {
  message: string;
}

const ErrorMsg1 = ({ message }: ErrorMsgProps) => {
  return (
    <div className="page-error-msg text-center">
      <h1>🤷</h1>
      <h2>{message}</h2>
    </div>
  );
};

export default ErrorMsg1;
