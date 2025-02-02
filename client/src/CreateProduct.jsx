import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const Submit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("desc", desc);
    formData.append("productImg", image);  

    axios.post("http://localhost:3001/createProduct", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(result => {
      console.log(result);
      navigate('/product'); 
    })
    .catch(err => console.log(err));
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>

        <form onSubmit={Submit}>
          <h2>Add Product</h2>

          <div className='mb-2'>
            <label htmlFor="image">Image</label>
            <input type="file" className='form-control' 
              onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className='mb-2'>
            <label htmlFor="name">Name</label>
            <input type="text" placeholder='Enter Name' className='form-control'
              onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='mb-2'>
            <label htmlFor="price">Price</label>
            <input type="text" placeholder='Enter Price' className='form-control'
              onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className='mb-2'>
            <label htmlFor="desc">Description</label>
            <textarea type="text" placeholder='Enter Description' className='form-control'
              onChange={(e) => setDesc(e.target.value)} 
              rows="4"
              style={{ resize: 'vertical' }}
              />
          </div>

          <button className='btn btn-success' type="submit">Submit</button>
        </form>

      </div>
    </div>
  );
}

export default CreateProduct;
