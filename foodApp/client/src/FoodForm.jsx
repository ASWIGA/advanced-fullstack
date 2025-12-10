import React, { useState } from "react";
import axios from "axios";

const FoodForm = () => {
  const [foodName, setFoodName] = useState("");
  const [days, setDays] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8000/insert", {
      foodName: foodName,
      daySinceAte: days,   // MUST MATCH BACKEND FIELD
    });

    alert("Food inserted!");
    setFoodName("");
    setDays("");
  };

  return (
    <div>
      <h2>Add Food</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Food name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
        <br />

        <input
          type="number"
          placeholder="Days since ate"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <br />

        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default FoodForm;
