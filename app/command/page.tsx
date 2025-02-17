"use client";
import { useEffect, useState } from "react";
import { Command } from "cmdk";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};
const CommandPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Todo | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      setTodos(data);
    };

    fetchTodos().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <Command.Dialog
        title="Search Todos"
        className="flex flex-col  mt-10 space-y-4 max-w-7xl mx-auto shadow-lg border-2 rounded-xl p-6"
        open={open}
        onOpenChange={setOpen}
      >
        <Command.Input
          className="w-full rounded-md placeholder:text-sm my-2 outline-none"
          placeholder="Search Todos..."
        />

        <Command.List className="h-56 space-y-4 overflow-auto">
          {loading && (
            <Command.Loading className="p-4 flex items-center justify-center">
              Hang on…
            </Command.Loading>
          )}

          {!loading && todos.length === 0 && (
            <Command.Empty>No results found.</Command.Empty>
          )}

          {!loading && todos && (
            <Command.Group title="">
              {todos.map((todo) => {
                return (
                  <Command.Item
                    key={todo.id}
                    onSelect={() => setSelected(todo)}
                    className={`px-6 py-4 flex rounded-md item-center cursor-pointer text-md text-black justify-between ${
                      selected?.id === todo.id
                        ? "bg-neutral-100"
                        : "hover:bg-neutral-100 text-black"
                    }`}
                  >
                    <span className="font-semibold">
                      {todo.id} - {todo.title}
                    </span>

                    <span>
                      {todo.completed ? (
                        <span className="text-blue-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-red-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          )}
        </Command.List>
      </Command.Dialog>
    </div>
  );
};

export default CommandPage;
