/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={processingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isProcessed={true} />}
    </section>
  );
};
