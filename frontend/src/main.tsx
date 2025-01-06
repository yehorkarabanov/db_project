import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
// @ts-ignore
import "./index.css"
import MainPage from "@/pages/MainPage";
import ClientOrdersPage from "@/pages/Orders/ClienOrderPage";
import Clients from "@/pages/Clients/Clients";
import Workers from "@/pages/Workers/Workers";
import ProductInfo from "@/pages/Products/ProductInfo";
import Products from "@/pages/Products/Products";
import Orders from "@/pages/Orders/Orders";
import ProductCreate from "@/pages/Products/ProductCreate";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path={"/orders/all"} element={<Orders/>}/>
                <Route path="/orders" element={<ClientOrdersPage/>}/>
                <Route path="/clients" element={<Clients/>}/>
                <Route path="/workers" element={<Workers/>}/>
                <Route path="/products/new" element={<ProductCreate/>}/>
                <Route path="/products/:product_name" element={<ProductInfo/>}/>
                <Route path="/products" element={<Products/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
