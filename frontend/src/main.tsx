import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
// @ts-ignore
import "./index.css"
import MainPage from "@/pages/MainPage";
import ClientOrdersPage from "@/pages/ClienOrderPage";
import Clients from "@/pages/Clients";
import Workers from "@/pages/Workers";
import ProductInfo from "@/pages/ProductInfo";
import Products from "@/pages/Products";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/orders" element={<ClientOrdersPage/>}/>
                <Route path="/clients" element={<Clients/>}/>
                <Route path="/workers" element={<Workers/>}/>
                <Route path="/product/:product_name" element={<ProductInfo/>}/>
                <Route path="/products" element={<Products/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
