import { useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import axios from 'axios';

const TodoList = ({ isRefresh, setRefresh }) => {
  // State untuk menyimpan daftar todos, filter, query pencarian, dan hasil pencarian
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const API_URL = 'http://localhost:3000/todos';

  useEffect(() => {
    if (isRefresh) {
      axios
        .get(API_URL)
        .then((res) => {
          setRefresh(false);
          setTodos(res.data);
        })
        .catch((err) => {
          setRefresh(false);
          if (err.name === 'AbortError') {
            console.log('fetch aborted.');
          }
        });
    }
  }, [isRefresh, setRefresh, API_URL]);

  // Fungsi untuk melakukan pencarian berdasarkan query
  const searchHandler = () => {
    if (query.length === 0) {
      setQueryResults([]);
      return;
    }

    setQueryResults(
      todos.filter((todo) =>
        todo.task.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // Menyimpan hasil pencarian jika ada, jika tidak, tampilkan semua todos
  const results = queryResults.length !== 0 ? queryResults : todos;

  const filteredTodos =
    filter === 'all'
      ? results
      : filter === 'done'
      ? results.filter((todo) => todo.complete === true)
      : filter === 'todo' && results.filter((todo) => todo.complete === false);

  // Fungsi untuk menghapus todo berdasarkan ID
  const deleteTodo = (id) => {
    console.log('Id dari delete ', id);
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        console.log('todo deleted.');
        setRefresh(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Fungsi untuk menghapus semua todos yang selesai
  const deleteDoneTaskHandler = async () => {
    try {
      const completedTodoId = todos
        .filter((todo) => todo.complete === true)
        .map((todo) => todo.id);

      for (const id of completedTodoId) {
        await axios.delete(`${API_URL}/${id}`);
      }

      setRefresh(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Fungsi untuk menghapus semua todos
  const deleteAllTaskHandler = async () => {
    try {
      const todoId = todos.map((todo) => todo.id);
      for (const id of todoId) {
        await axios.delete(`${API_URL}/${id}`);
      }
      setRefresh(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="filter-and-search">
        <h3>Todo Search And Filter</h3>
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="add-button" onClick={searchHandler}>
            Search
          </span>
        </div>
        <div className="filter">
          <button className="filter-button" onClick={() => setFilter('all')}>
            All
          </button>
          <button className="filter-button" onClick={() => setFilter('done')}>
            Done
          </button>
          <button className="filter-button" onClick={() => setFilter('todo')}>
            To do
          </button>
        </div>
      </div>
      <ul id="todo-list">
        {filteredTodos.length === 0 ? (
          <h3 className="result-text mt-3">Empty</h3>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              todo={todo}
              setRefresh={setRefresh}
              deleteTodo={deleteTodo}
              key={todo.id}
            />
          ))
        )}
        <div className="d-flex gap-4 mt-5">
          <button
            className="btn btn-danger w-100"
            onClick={deleteDoneTaskHandler}
          >
            Delete Done Task
          </button>
          <button
            className="btn btn-danger w-100"
            onClick={deleteAllTaskHandler}
          >
            Delete All Task
          </button>
        </div>
      </ul>
    </>
  );
};

export default TodoList;
