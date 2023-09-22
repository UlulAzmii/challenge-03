import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

const Header = ({ setRefresh }) => {
  const [task, setTask] = useState(''); // State untuk menyimpan nilai input task

  // Fungsi untuk menambahkan todo baru ke server
  const addTodo = () => {
    if (!task.trim()) {
      // Periksa apakah input task tidak kosong atau hanya whitespace
      return; // Jika kosong, jangan lakukan apa-apa
    }

    // Membuat objek baru untuk todo dengan task yang diambil dari state
    const newTodo = { task, complete: false };

    axios
      .post('http://localhost:3000/todos', newTodo, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setTask('');
        setRefresh((prevRefresh) => !prevRefresh);
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
      });
  };

  return (
    <>
      <Container className="mt-2">
        <Row className="header">
          <div id="todo-header">
            <h2>TodoList</h2>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Add Task..."
            />
            <span className="add-button" onClick={addTodo}>
              Add
            </span>
          </div>
        </Row>

        <Row>
          <Col className="col-5"></Col>
          <Col>
            <Link to="/">
              <span className="add-back">Back</span>
            </Link>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
};

export default Header;
