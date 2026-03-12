/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React from 'react';
import { Todo } from './types';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  processingIds?: number[];
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  processingIds = [],
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="Todos">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isProcessed={processingIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};








