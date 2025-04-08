/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */

import React from 'react';
import { Todo } from './types';

interface Props {
  todo: Todo;
  onDelete?: (id: number) => void;
  isProcessed?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessed = false,
}) => {
  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          type="checkbox"
          id={`todo-status-${todo.id}`}
          className="todo__status"
          checked={todo.completed}
          readOnly
          data-cy="TodoStatus"
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      {onDelete && (
        <button
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        className={`modal overlay ${isProcessed ? 'is-active' : 'hidden'}`}
        data-cy="TodoLoader"
      >
        <div className="modal__content">
          <div className="loader"></div>
        </div>
      </div>
    </div>
  );
};
