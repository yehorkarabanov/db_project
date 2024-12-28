import React, {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "@/components/ui/accordion";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import ProductModal from "@/components/ProductModal.jsx";
import {NavLink} from "react-router";
import {Separator} from "@/components/ui/separator"

const ClientOrdersPage = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const [clientData, setClientData] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (email) {
            fetch(`http://localhost:8080/api/data/orders_by_mail/${email}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch client data");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (Array.isArray(data) && data.length > 0 && data[0]?.client_data) {
                        setClientData(data[0].client_data);
                    } else {
                        throw new Error("Invalid response format");
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            setError("Email query parameter is missing");
            setLoading(false);
        }
    }, [email]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!clientData) {
        return <p>No client data available.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Client Orders</h1>

            {/* Client Info Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <p>
                            <strong>Name:</strong> {clientData.client_info?.name || "N/A"}
                        </p>
                        <p>
                            <strong>Email:</strong> {clientData.client_info?.email || "N/A"}
                        </p>
                        <p>
                            <strong>Money Available:</strong> $
                            {clientData.client_info?.money?.toFixed(2) || "N/A"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Accordion */}
            <Accordion type="single" collapsible>
                {clientData.orders?.map((order) => (
                    <AccordionItem key={order.order_id} value={`order-${order.order_id}`}>
                        <AccordionTrigger>
                            Order #{order.order_id} - {order.order_date}
                        </AccordionTrigger>
                        <AccordionContent>
                            <div>
                                <p>
                                    <strong>Worker:</strong> {order.worker?.name || "N/A"}
                                </p>

                                {/* Product Table */}
                                <Table className="mt-4 w-full">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Manufacturer</TableCell>
                                            <TableCell>Warehouse Location</TableCell>
                                        </TableRow>
                                        {order.products?.map((product, index) => (
                                            <TableRow
                                                key={index}
                                                onClick={() => handleProductClick(product)}
                                                className="cursor-pointer hover:bg-gray-100"
                                            >
                                                <TableCell>{product.product_name}</TableCell>
                                                <TableCell>${product.product_price}</TableCell>
                                                <TableCell>{product.product_amount}</TableCell>
                                                <TableCell>{product.manufacturer?.name || "N/A"}</TableCell>
                                                <TableCell>{product.warehouse?.location || "N/A"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* Product Modal */}
            <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal}/>
        </div>
    );
};

export default ClientOrdersPage;
