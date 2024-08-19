import React from "react";
import Header from "./components/header/Header";
import Todo from "./components/Todo/Todo";
const App = () => {
  return (
    <>
      <Header />
      <main>
        <Todo />
      </main>
    </>
  );
};

export default App;
