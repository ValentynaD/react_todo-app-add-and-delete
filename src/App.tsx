/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { TodoList } from './TodoList';
import { Todo } from './types';

const USER_ID = 123;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://mate-academy.github.io/fe-students-api/todos?userId=${USER_ID}`,
    )
      .then(response => response.json())
      .then((data: Todo[]) => {
        setTodos(data);
      })
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const response = await fetch(
        'https://mate-academy.github.io/fe-students-api/todos',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo),
        },
      );

      if (!response.ok) {
        throw new Error('Unable to add a todo');
      }

      const createdTodo = await response.json();

      setTodos(prev => [...prev, createdTodo]);
      setTempTodo(null);
      setTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
      setTitle(trimmedTitle);
      setTempTodo(null);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const deleteTodo = async (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const response = await fetch(
        `https://mate-academy.github.io/fe-students-api/todos/${id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Unable to delete a todo');
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
  };

  const hideError = () => {
    setErrorMessage('');
  };

  const hasCompleted = todos.some(todo => todo.completed);
  const notCompletedCount = todos.filter(todo => !todo.completed).length;

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <form onSubmit={addTodo}>
            <input
              type="text"
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isLoading}
              data-cy="NewTodoField"
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {notCompletedCount} items left
            </span>
            <div className="filters" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </div>
            <button
              className="todoapp__clear-completed"
              onClick={clearCompleted}
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={`notification is-danger ${errorMessage ? '' : 'hidden'}`}
        data-cy="ErrorNotification"
      >
        <span>{errorMessage}</span>
        {errorMessage && (
          <button
            className="delete"
            data-cy="HideErrorButton"
            onClick={hideError}
          />
        )}
      </div>
    </div>
  );
};
