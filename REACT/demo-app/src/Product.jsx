import React, { useState, useEffect } from 'react';
import axios from 'axios';



const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products")
      .then(response => {
        console.log('Products fetched:', response.data);
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      {products.map(product => (
        <div key={product.id} style={{ marginBottom: "20px" }}>
          <h3>{product.title}</h3>
          <img src={product.image} alt={product.title} width="100" />
          <p>{product.description}</p>
          <p><strong>Price: ${product.price}</strong></p>
        </div>
        
      ))}
    </div>
  );
};

export default Product;
