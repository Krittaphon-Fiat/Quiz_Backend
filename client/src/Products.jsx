import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Products() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3001')
            .then(result => setProducts(result.data))
            .catch(err => console.log(err))
    }, [])

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/deleteProduct/' + id)
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="d-flex bg-primary justify-content-center align-items-start p-4" style={{ minHeight: '100vh' }}>
            <div className="w-75 bg-white rounded p-3 shadow-lg">
                <Link to="/create" className='btn btn-success mb-3'>Add + </Link>

                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className='table table-bordered'>
                        <thead className="table-dark">
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={`http://localhost:3001${product.image}`}
                                            className="card-img-top"
                                            alt={product.name}
                                            style={{ height: '40px', width: '40px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.desc}</td>
                                    <td>
                                        <Link to={`/update/${product._id}`} className='btn btn-success btn-sm me-2'>Update</Link>
                                        <button className='btn btn-danger btn-sm' onClick={() => handleDelete(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Products;
