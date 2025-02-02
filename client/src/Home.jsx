import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(8); 

    useEffect(() => {
        axios.get(`http://localhost:3001/products?page=${currentPage}&limit=${limit}`)
            .then(result => {
                setProducts(result.data.products);
                setTotalPages(Math.ceil(result.data.totalCount / limit));
            })
            .catch(err => console.log(err));
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center min-vh-100 bg-light py-4">
            <h2 className="mb-4">Product List</h2>

            <div className="container">
                <div className="row justify-content-center">
                    {products.map((product, index) => (
                        <div key={index} className="col-md-3 mb-4">
                            <div className="card shadow-sm p-3">
                                <img 
                                    src={`http://localhost:3001${product.image}`} 
                                    className="card-img-top" 
                                    alt={product.name} 
                                    style={{ height: "180px", objectFit: "cover" }} 
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title">{product.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">${product.price}</h6>
                                    <p className="card-text">{product.desc.substring(0, 30)}...</p>
                                    <Link to={`/product/${product._id}`} className="btn btn-success w-100">Detail</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
                <button 
                    className="btn btn-secondary me-3"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ⬅ Previous
                </button>
                <span className="fs-5 fw-bold">{currentPage} / {totalPages}</span>
                <button 
                    className="btn btn-secondary ms-3"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next ➡
                </button>
            </div>
        </div>
    );
}
