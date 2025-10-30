import React from "react";
import { CheckSquareIcon } from "./icons";

export const Header = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3">
        <CheckSquareIcon className="w-10 h-10 text-blue-600" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
          Todo List
        </h1>
      </div>
      <p className="mt-2 text-lg text-gray-500">Your daily task manager</p>
    </header>
  );
};