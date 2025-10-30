import React from "react";
import { TodoItem } from "./TodoItem";

export const TodoList = ({
  todos,
  onToggleComplete,
  onUpdateTitle,
  onDelete,
}) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">
          You have no tasks yet. Add one above!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onUpdateTitle={onUpdateTitle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};