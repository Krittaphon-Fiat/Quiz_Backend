import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Product from './Products'
import CreateProduct from './CreateProduct'
import UpdateProduct from './UpdateProduct'
import Home from './Home'
import TopBar from './components/TopBar'
import ProductDetail from './ProductDetail'
import Cart from './Cart'


function App() {

  return (
    
    <div>
      <BrowserRouter>
        <TopBar/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/product' element={<Product/>}></Route>
          <Route path='/create' element={<CreateProduct/>}></Route>
          <Route path='/update/:id' element={<UpdateProduct/>}></Route>
          <Route path='/product/:id' element={<ProductDetail/>}></Route>
          <Route path='/cart' element={<Cart/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
