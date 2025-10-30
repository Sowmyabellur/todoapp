import React, { useState, useRef, useEffect } from "react";
import { EditIcon, TrashIcon, SaveIcon, CancelIcon } from "./icons";

export const TodoItem = ({
  todo,
  onToggleComplete,
  onUpdateTitle,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== todo.title) {
      onUpdateTitle(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <li className="flex items-center p-4 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md hover:bg-white">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id, !todo.completed)}
        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
      />
      <div className="ml-4 grow">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full px-2 py-1 border-b-2 border-blue-500 bg-transparent focus:outline-none"
          />
        ) : (
          <span
            className={`text-lg ${
              todo.completed ? "text-gray-400 line-through" : "text-gray-800"
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>
      <div className="ml-4 shrink-0 flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1 text-green-500 hover:text-green-700 transition-colors"
              aria-label="Save"
            >
              <SaveIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Cancel"
            >
              <CancelIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Delete"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </li>
  );
};