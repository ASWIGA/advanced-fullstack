import React from "react";
import FoodForm from "./FoodForm";
import FoodList from "./FoodList";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Food App</h1>
      <FoodForm />
      <FoodList />
    </div>
  );
}

export default App;