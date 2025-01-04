import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Modal from "@/components/AlertModal.jsx";
import {Plus, Search, Package, ClipboardList, Users, Briefcase} from "lucide-react";

const MainPage = () => {
    const [email, setEmail] = useState("");
    const [product, setProduct] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const openModal = (title, description) => {
        setModalTitle(title);
        setModalDescription(description);
        setIsModalOpen(true);
    };

    const handleFindProduct = () => {
        if (!product || product.trim().length === 0) {
            openModal("Error", "Product name cannot be empty.");
            return;
        }
        navigate(`/product/${encodeURIComponent(product)}`);
    };

    const handleSeeOrders = () => {
        if (isValidEmail(email)) {
            navigate(`/orders?email=${encodeURIComponent(email)}`);
        } else {
            openModal("Error", "Please enter a valid email address.");
        }
    };

    const handleCreateOrder = () => {
        navigate("/orders/new");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Product Search Card */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Package className="mr-2 h-5 w-5 text-blue-500"/>
                                Products
                            </CardTitle>
                            <CardDescription>Search for a product by its name.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="product">Product Name</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="product"
                                            type="text"
                                            value={product}
                                            onChange={(e) => setProduct(e.target.value)}
                                            placeholder="Enter product name"
                                            className="flex-1"
                                        />
                                        <Button onClick={handleFindProduct}>
                                            <Search className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            navigate("/products")
                                        }}
                                        className="flex-1"
                                    >
                                        View all Products
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            navigate("/products/new")
                                        }}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        New Product
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Search Card */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <ClipboardList className="mr-2 h-5 w-5 text-blue-500"/>
                                Orders
                            </CardTitle>
                            <CardDescription>View or create orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                        />
                                        <Button onClick={handleSeeOrders}>
                                            <Search className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => {
                                            navigate("/orders/all")
                                        }}
                                        className="flex-1"
                                        variant="outline"
                                    >
                                        View all Orders
                                    </Button>
                                    <Button
                                        onClick={handleCreateOrder}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        New Order
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Access Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center">Quick Access</CardTitle>
                        <CardDescription>Navigate to different sections of the application</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/clients")}
                                className="h-24 flex flex-col items-center justify-center space-y-2"
                            >
                                <Users className="h-6 w-6 text-blue-500"/>
                                <span>Clients</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/workers")}
                                className="h-24 flex flex-col items-center justify-center space-y-2"
                            >
                                <Briefcase className="h-6 w-6 text-blue-500"/>
                                <span>Workers</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/products")}
                                className="h-24 flex flex-col items-center justify-center space-y-2"
                            >
                                <Package className="h-6 w-6 text-blue-500"/>
                                <span>Products</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    navigate("/orders/all")
                                }}
                                className="h-24 flex flex-col items-center justify-center space-y-2"
                            >
                                <ClipboardList className="h-6 w-6 text-blue-500"/>
                                <span>All Orders</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={modalTitle}
                description={modalDescription}
                onConfirm={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default MainPage;