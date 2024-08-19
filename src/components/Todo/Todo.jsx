import React, { useEffect, useState } from "react";
import addIcon from "/assets/icons/add.svg";
import emptyIcon from "/assets/icons/board.svg";
import taskIcon from "/assets/icons/task.svg";
import checkIcon from "/assets/icons/check.svg";
import binIcon from "/assets/icons/bin.svg";
import styles from "./todo.module.scss";
import apiRequest from "../../apiRequest";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  // fetch data
  const fetchData = async () => {
    const url = "http://localhost:3500/tasks";
    const data = await apiRequest(url);
    if (data.error) {
      setError(data.error);
    } else {
      setTasks(data);
      setTotalTasks(data.length);
    }
  };
  // add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const url = "http://localhost:3500/tasks";

    const task = {
      id: `${Date.now()}`,
      title: newTask,
      completed: false,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    };
    const data = await apiRequest(url, options);
    if (data.error) {
      setError(data.error);
    } else {
      setTasks((prevTasks) => [...prevTasks, task]);
      setTotalTasks((prevTotal) => prevTotal + 1);
      setNewTask("");
    }
  };
  // remove task
  const handleRemoveTask = async (id) => {
    const url = `http://localhost:3500/tasks/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = await apiRequest(url, options);
    if (data.error) {
      setError(data.error);
    } else {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setTotalTasks((prevTotal) => prevTotal - 1);
    }
  };
  // mark task as completed
  const handleCompleteTask = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    const url = `http://localhost:3500/tasks/${id}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: updatedTask.completed }),
    };
    const data = await apiRequest(url, options);
    if (data.error) {
      setError(data.error);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    }
  };
  // fetch data
  useEffect(() => {
    fetchData();
  }, []);
  // update completed task count
  useEffect(() => {
    const compNum = tasks.filter((task) => task.completed).length;
    const totalNum = tasks.length;
    if (totalNum > 0) {
      setCompletedTasks(`${compNum} of ${totalNum}`);
    } else {
      setCompletedTasks(0);
    }
  }, [tasks]);

  if (error) return <div>Error: {error}</div>;
  return (
    <section className={styles.todo__container}>
      <div className={styles.todo__content}>
        <div className={styles.task__input}>
          <form onSubmit={handleAddTask}>
            <label>
              <input
                onChange={(e) => {
                  setNewTask(e.target.value);
                }}
                value={newTask}
                type="text"
                placeholder="Add a new task"
                required
              />
            </label>
            <button type="submit">
              Add
              <img src={addIcon} alt="addicon" />
            </button>
          </form>
        </div>
        <div className={styles.task__list}>
          <div className={styles.list__header}>
            <div className={styles.created}>
              <p>Tasks Created</p>
              <span>{totalTasks}</span>
            </div>
            <div className={styles.completed}>
              <p>Completed</p>
              <span className={tasks.length > 0 ? styles.two : ""}>
                {completedTasks}
              </span>
            </div>
          </div>
          <div className={styles.list__items}>
            <div className={styles.empty}>
              <img src={emptyIcon} alt="empty" />
              <p>
                You don't have any tasks registered yet Create tasks and
                organize your to-do items
              </p>
            </div>
            {tasks.map((task) => (
              <div key={task.id} className={styles.task}>
                <div className={styles.task__title}>
                  <button onClick={() => handleCompleteTask(task.id)}>
                    <img
                      src={task.completed ? checkIcon : taskIcon}
                      alt="taskIcon"
                    />
                  </button>
                  <p className={task.completed ? styles.completed : ""}>
                    {task.title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleRemoveTask(task.id);
                  }}
                  className={styles.remove__btn}
                >
                  <img src={binIcon} alt="binIcon" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Todo;
