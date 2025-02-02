import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateProduct() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/getProduct/${id}`)
      .then(result => {
        console.log(result);
        setName(result.data.name);
        setPrice(result.data.price);
        setDesc(result.data.desc);
        setPreview(result.data.image);
      })
      .catch(err => console.log(err));
  }, [id]);

  const Update = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("desc", desc);
    if (image) {
      formData.append("productImg", image); 
    }

    axios.put(`http://localhost:3001/updateProduct/${id}`, formData, {
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
        <form onSubmit={Update}>
          <h2>Update Product</h2>

          {preview && (
            <div className="mb-2">
              <label>Current Image</label>
              <div>
                <img src={`http://localhost:3001${preview}`} alt="Current Product" width="100" />
              </div>
            </div>
          )}

          <div className='mb-2'>
            <label>New Image (optional)</label>
            <input type="file" className='form-control' 
              onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className='mb-2'>
            <label>Name</label>
            <input type="text" className='form-control' value={name}
              onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='mb-2'>
            <label>Price</label>
            <input type="text" className='form-control' value={price}
              onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className='mb-2'>
            <label>Description</label>
            <textarea type="text" className='form-control' value={desc}
              onChange={(e) => setDesc(e.target.value)} 
              rows="4"
              style={{ resize: 'vertical' }}
              />
          </div>

          <button className='btn btn-success'>Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;
