import React, { useState } from "react";
import { PlusIcon } from "./icons";

export const AddTodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isAdding) return;

    setIsAdding(true);
    await onAdd(title.trim());
    setTitle("");
    setIsAdding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="grow w-full px-4 py-3 text-lg bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        disabled={isAdding}
      />
      <button
        type="submit"
        className="shrink-0 px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center"
        disabled={!title.trim() || isAdding}
      >
        <PlusIcon className="w-5 h-5" />
        <span className="ml-2 hidden sm:inline">
          {isAdding ? "Adding..." : "Add Task"}
        </span>
      </button>
    </form>
  );
};