import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch the list of products from the API
        axios
            .get("http://localhost:8080/api/data/products")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Product List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <Card key={index} className="shadow-lg">
                            <CardHeader>
                                <CardTitle>{product.product_name}</CardTitle>
                                <CardDescription>
                                    {product.manufacturer_name} ({product.manufacturer_country})
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p><strong>Price:</strong> ${product.product_price}</p>
                                    <p><strong>Place Taken:</strong> {product.product_place_taken}</p>
                                    <Separator/>
                                    <p><strong>Types:</strong> {product.product_types.join(", ")}</p>
                                    <Separator/>
                                    <Button variant="outline" className="w-full" onClick={() => {
                                        navigate(`/product/${encodeURIComponent(product.product_name)}`);
                                    }}>View Details</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
            <Button onClick={handleBack} className="mt-4">Go Back</Button>
        </div>
    );
};

export default ProductList;
