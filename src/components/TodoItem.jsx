import { useState } from 'react';

const TodoItem = ({ todo, setRefresh }) => {
  // State untuk nilai teks saat pengeditan
  const [editText, setEditText] = useState(todo.task);
  // State untuk mengontrol mode pengeditan
  const [isEditing, setIsEditing] = useState(false);

  // Fungsi untuk update status ceklist todo
  const updateTodo = () => {
    todo.complete = !todo.complete;

    // Mengirim permintaan PUT ke server untuk memperbarui todo
    fetch('http://localhost:3000/todos/' + todo.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    }).then(() => {
      console.log('todo updated.');
      setRefresh(true);
    });
  };

  // Fungsi untuk hapus todo
  const deleteTodo = () => {
    console.log('Id dari delete ', todo.id);
    fetch('http://localhost:3000/todos/' + todo.id, {
      method: 'DELETE',
    }).then(() => {
      console.log('todo deleted.');
      setRefresh(true);
    });
  };

  // Fungsi untuk mengubah teks task pada todo saat pengeditan
  const changeTodo = () => {
    // Menggunakan spread operator untuk membuat objek baru yang memperbarui task
    const editedTodo = { ...todo, task: editText };

    fetch('http://localhost:3000/todos/' + todo.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    
      body: JSON.stringify(editedTodo),
    }).then(() => {
      console.log('todo updated.');
     
      setIsEditing(false);
      setRefresh(true);
    });
  };

  return (
    <li className={`${todo.complete ? 'checked' : ''}`}>
      <div>
        {isEditing ? (
          <div className="task-container">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <span className="add-button" onClick={changeTodo}>
              Add
            </span>
          </div>
        ) : (
          <div className="task-container">
            <div className="task-item" >
              {todo.task}
            </div>
            <span className="close" onClick={updateTodo}>
              <img src="/src/assets/icons8-tick-box.svg" />
            </span>
            <span className="close" onClick={deleteTodo}>
              <img src="/src/assets/icons8-trash.svg" />
            </span>
            <span className="close" onClick={() => setIsEditing(true)}>
              <img src="/src/assets/icons8-edit.svg" />
            </span>
          </div>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
