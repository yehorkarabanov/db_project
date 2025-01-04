import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
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


const ProductInfo = () => {
    const navigate = useNavigate();
    const {product_name} = useParams();
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        if (!product_name) return;

        const encodedProductName = encodeURIComponent(product_name);

        axios
            .get(`http://localhost:8080/api/data/product/${encodedProductName}`)
            .then((response) => {
                setProductData(response.data.product_details);
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
            });
    }, [product_name]);

    if (!productData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading product data...</p>
            </div>
        );
    }

    const {
        product = {},
        manufacturer = {},
        warehouse = {},
        types = [],
        orders = [],
        total_ordered = 0,
    } = productData;
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{manufacturer.name} ({manufacturer.country})</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p><strong>Price:</strong> ${product.price}</p>
                        <Separator/>
                        <p><strong>Warehouse:</strong></p>
                        <ul>
                            <li><strong>Location:</strong> {warehouse.location}</li>
                            <li><strong>Capacity:</strong> {warehouse.capacity}</li>
                        </ul>
                        <Separator/>
                        <p><strong>Types:</strong> {types.join(", ")}</p>
                        <Separator/>
                        <p><strong>Total Ordered:</strong> {total_ordered}</p>
                        <Separator/>
                        <h2 className="font-semibold">Orders</h2>
                        {orders.length > 0 ? (
                            <ul className="space-y-2">
                                {orders.map((order) => (
                                    <li
                                        key={order.order_id}
                                        className="border rounded-md p-2 bg-gray-50"
                                    >
                                        <p><strong>Order ID:</strong> {order.order_id}</p>
                                        <p><strong>Amount:</strong> {order.amount}</p>
                                        <p><strong>Arrival Date:</strong> {order.arrival_date}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No orders available.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Button onClick={handleBack} className="mt-4">Go Back</Button>
        </div>
    );
};

export default ProductInfo;
