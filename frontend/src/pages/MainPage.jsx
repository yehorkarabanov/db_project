import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MainPage = () => {
    const [email, setEmail] = useState("");
    const [product, setProduct] = useState("");
    const navigate = useNavigate(); // Hook for redirection

    // Function to validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleFindProduct = () => {
        navigate(`/product/${encodeURIComponent(product)}`);
        // Add logic for finding the product
    };

    const handleSeeOrders = () => {
        if (isValidEmail(email)) {
            // If email is valid, redirect to the orders page with the email as query parameter
            navigate(`/orders?email=${encodeURIComponent(email)}`);
        } else {
            // If email is invalid, show an alert or some message
            alert("Please enter a valid email address.");
        }
    };

    // Navigation functions for Clients and Workers
    const handleNavigateToClients = () => {
        navigate("/clients"); // Navigate to the Clients page
    };

    const handleNavigateToWorkers = () => {
        navigate("/workers"); // Navigate to the Workers page
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Main page</h1>

            {/* Product Search Card */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Find Product</CardTitle>
                    <CardDescription>Search for a product by its name.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="product">Product Name</Label>
                            <Input
                                id="product"
                                type="text"
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                placeholder="Enter product name"
                            />
                        </div>
                        <Button onClick={handleFindProduct} className={"mr-4"}>Find Product</Button>
                        <Button onClick={() => navigate("/products")}>View All Products</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Order Search Card */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>See Orders</CardTitle>
                    <CardDescription>View your orders by entering your email address.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <Button onClick={handleSeeOrders}>See Orders</Button>
                    </div>
                </CardContent>
            </Card>

            {/* New Cart for Clients and Workers */}
            <Card>
                <CardHeader>
                    <CardTitle>Navigate to Clients or Workers</CardTitle>
                    <CardDescription>Select where you'd like to go.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex">
                        <Button className={"mr-4"} onClick={handleNavigateToClients}>Go to Clients</Button>
                        <Button onClick={handleNavigateToWorkers}>Go to Workers</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MainPage;
