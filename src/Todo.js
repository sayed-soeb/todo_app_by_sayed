import React, { useState, useEffect , useRef} from 'react';
import { Chart } from 'chart.js/auto';
import './Todo.css';

function Todo() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [updated, setUpdated] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    // Load todos from local storage when the component mounts
    const storedTodos = localStorage.getItem('todos');
    const storedUpdated = localStorage.getItem('updated');
    if (storedTodos && JSON.parse(storedTodos).length > 0) {
        setTodos(JSON.parse(storedTodos));
  }
  if (storedUpdated && JSON.parse(storedUpdated).length > 0) {
    setUpdated(JSON.parse(storedUpdated));
}
}, []);

useEffect(() => {
    // Calculate the number of completed and incomplete todos
    const completedCount = updated.length;
    const incompleteCount = todos.length;

    // Get the canvas element by its id
    const pieChartCanvas = document.getElementById('pieChart');

    // Check if the Chart exist or not
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new Chart instance and store it in the ref
    chartRef.current = new Chart(pieChartCanvas, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Incomplete'],
        datasets: [
          {
            data: [completedCount, incompleteCount],
            backgroundColor: ['#a8ffa0','#124f85'],
          },
        ],
      },
    });
  }, [todos, updated]);

//whenever todos updated it will store todo in localstorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  //It will store updated todo whenever todo is updated
  useEffect(() => {
    localStorage.setItem('updated', JSON.stringify(updated));
  }, [updated]);

  const handleInputChange = (e) => {
    setTodo(e.target.value);
  };

  const completeTodo = (index) => {
    const updatedTodos = [...todos];
    const completedTodo = updatedTodos[index]; // Get the completed todo
    completedTodo.completed = true;
  
    // Remove the completed item from 'todos'
    updatedTodos.splice(index, 1);
  
    // Update the 'todos' list without the completed item
    setTodos(updatedTodos);
  
    // Add the completed item to the 'updated' list
    setUpdated([completedTodo,...updated]);
    console.log(updated)
  };

  const addTodo = () => {
    if (todo.trim() !== '') {
      setTodos([{ text: todo, completed: false }, ...todos]);
      setTodo('');
    }
  };

  const resetTodos = () => {
    // Clear the TODO list
    setTodos([]);
    setUpdated([]);
    // Also clear local storage
    localStorage.removeItem('todos');
    localStorage.removeItem('updated');
  };

  const handleEditTodo = (index) => {
    const updatedText = prompt('Edit TODO:', todos[index].text);
    if (updatedText !== null) {
      const updatedTodos = [...todos];
      updatedTodos[index].text = updatedText;
      setTodos(updatedTodos);
    }
  };

  const handleEditUpdate = (index) => {
    const updatedText = prompt('Edit TODO:', updated[index].text);
    if (updatedText !== null) {
      const updatedTodos = [...updated];
      updatedTodos[index].text = updatedText;
      setUpdated(updatedTodos);
    }
  };

  const handleDeleteTodo = (index) => {
    const deleteTo = window.confirm('Are you sure you want to delete this TODO?');
    if (deleteTo) {
      const delTodos = [...todos];
      delTodos.splice(index, 1);
      setTodos(delTodos);
    }
  };
  
  const handleDeleteUpdate = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this TODO?');
    if (confirmDelete) {
      const updatedTodos = [...updated];
      updatedTodos.splice(index, 1);
      setUpdated(updatedTodos);
    }
  };


  return (
    <>
    <div className="bg">
    <div className="container">
    <h1>Todo App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a Todo ..."
          onChange={handleInputChange}
          value={todo}
          className="input"
        />
        <button onClick={addTodo} className="button">Add Todo</button>
        <button onClick={resetTodos} className="button">Reset Todo</button>
      </div>
    </div>
    <div className="todocont">
        <div className='todolist'>
            <h1>Todo List</h1>
    <ul>
    {todos &&
  todos.map((todo, index) => (
    <div className='todoss'>
      <li className={todo.completed ? 'completed-todo' : ''} onClick={() => completeTodo(index)}>
        {todo.text}
      </li>
      <span className="actions">
        <span className="edit-icon" onClick={() => handleEditTodo(index)}>
          <i className="fas fa-edit"></i>
        </span>
        <span className="delete-icon" onClick={() => handleDeleteTodo(index)}>
          <i className="fas fa-trash"></i>
        </span>
      </span>
    </div>
  ))}
      {updated &&
  updated.map((todo, index) => (
    <li key={index} className={todo.completed ? 'completed-todo' : ''}>
      {todo.text}
      <span className="actions">
      <span
        className="edit-icon"
        onClick={() => handleEditUpdate(index)}
      >
         <i className="fas fa-edit"></i>
      </span>
      <span
        className="delete-icon"
        onClick={() => handleDeleteUpdate(index)}
      >
 <i className="fas fa-trash"></i>
      </span>
      </span>
    </li>
  ))}
    </ul>
    </div>
    <div className="pie-chart-container">
        <h1>Progress</h1>
  <canvas id="pieChart" width="200" height="200"></canvas>
</div>
</div>
</div>
    </>
  );
}

export default Todo;
