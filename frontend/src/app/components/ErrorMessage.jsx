import React from "react";
import { AlertTriangleIcon } from "./icons";

export const ErrorMessage = ({ message }) => {
  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center"
      role="alert"
    >
      <AlertTriangleIcon className="w-6 h-6 mr-3" />
      <div>
        <p className="font-bold">Error</p>
        <p>{message}</p>
      </div>
    </div>
  );
};