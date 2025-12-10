import React, { useEffect, useState } from "react";
import axios from "axios";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [updateName, setUpdateName] = useState("");

  // Fetch data on load
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = () => {
    axios.get("http://localhost:8000/read").then((response) => {
      setFoods(response.data);
    });
  };

  const updateFood = async (id) => {
    await axios.put("http://localhost:8000/update", {
      id: id,
      newFoodName: updateName,
    });

    alert("Updated!");
    fetchFoods();
    setUpdateName("");
  };

  const deleteFood = async (id) => {
    await axios.delete(`http://localhost:8000/delete/${id}`);
    alert("Deleted!");
    fetchFoods();
  };

  return (
    <div>
      <h2>Food List</h2>

      {foods.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{item.foodName}</h3>
          <p>Days since ate: {item.daySinceIAte}</p>

          <input
            type="text"
            placeholder="New food name"
            onChange={(e) => setUpdateName(e.target.value)}
          />

          <button onClick={() => updateFood(item._id)}>Update</button>
          <button onClick={() => deleteFood(item._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default FoodList;