import React from "react";

const Alert = ({ children, className = "" }) => {
  return (
    <div role="alert" className={`rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
};

const AlertTitle = ({ children, className = "" }) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
};

const AlertDescription = ({ children, className = "" }) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};

export { Alert, AlertTitle, AlertDescription };
