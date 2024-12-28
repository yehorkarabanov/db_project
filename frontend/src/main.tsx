import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
// @ts-ignore
import "./index.css"
import MainPage from "@/pages/MainPage";
import ClientOrdersPage from "@/pages/ClienOrderPage";
import Clients from "@/pages/Clients";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/orders" element={<ClientOrdersPage/>}/>
                <Route path="/clients" element={<Clients/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
