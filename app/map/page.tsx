"use client";

import { ReactNode, useState, useSyncExternalStore } from "react";

class Observable {
  observers: ((...args: any[]) => void)[];
  constructor() {
    this.observers = [];
  }

  subscribe(func: (...args: any[]) => void) {
    this.observers.push(func);
    return () => {
      this.unsubscribe(func);
    };
  }

  unsubscribe(func: (...args: any[]) => void) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data: any) {
    this.observers.forEach((observer) => observer(data));
  }
}

type TodoItem = {
  id: string;
  content: string;
  isDone: boolean;
  createdAt: string;
};

class Todo extends Observable {
  todoList: TodoItem[];
  constructor() {
    super();
    this.todoList = [];
  }
  addTodo(newTodo: Pick<TodoItem, "content">) {
    const todo: TodoItem = {
      id: Math.random().toString(),
      content: newTodo.content,
      isDone: false,
      createdAt: new Date().toISOString(),
    };
    this.dispatch((prev) => [...prev, todo]);
  }

  deleteTodo(id: string) {
    this.dispatch((prev) => prev.filter((todo) => todo.id !== id));
  }

  toggleDone(id: string) {
    this.dispatch((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isDone: !todo.isDone };
        }
        return todo;
      }),
    );
  }

  private dispatch(fn: (prev: TodoItem[]) => TodoItem[]) {
    this.todoList = fn(this.todoList);
    this.notify(this.todoList);
  }

  getSnapshot() {
    return {
      todoList: this.todoList,
    };
  }
}

const useTodos = <T extends Todo>(store: T) => {
  let value = store.getSnapshot();
  const listeners = new Set<() => void>();
  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  };
  const getSnapshot = () => value;

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

const todo = new Todo();

export default function Home() {
  const value = useTodos(todo);
  const [input, setInput] = useState("");
  return (
    <div className="">
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        className=" w-full bg-slate-200"
        placeholder="hello"
      />
      <button
        onClick={() => {
          todo.addTodo({
            content: input,
          });
          setInput("");
        }}
      >
        서브밋
      </button>
      {value.todoList.map((todo) => (
        <div key={todo.id} className="">
          {todo.content}
        </div>
      ))}
    </div>
  );
}
