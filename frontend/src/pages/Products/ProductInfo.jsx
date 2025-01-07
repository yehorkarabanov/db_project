import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    Package,
    Factory,
    Warehouse,
    Calendar,
    ArrowLeft,
    Tag,
    ShoppingCart,
    Loader2,
    Pencil,
    Trash2,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProductInfo = () => {
    const navigate = useNavigate();
    const { product_name } = useParams();
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (!product_name) return;

        const encodedProductName = encodeURIComponent(product_name);
        setLoading(true);

        axios
            .get(`http://localhost:8080/api/products/${encodedProductName}`)
            .then((response) => {
                setProductData(response.data.product_details);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
                setError("Failed to load product data. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [product_name]);

    const handleEdit = () => {
        navigate(`/products/edit/${product_name}`);
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await axios.delete(`http://localhost:8080/api/products/${encodeURIComponent(product_name)}`);
            navigate('/products');
        } catch (error) {
            console.error("Error deleting product:", error);
            setError("Failed to delete product. Please try again later.");
            setShowDeleteDialog(false);
        }
        setDeleteLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-lg text-gray-600">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <p className="text-lg text-red-500">{error}</p>
                <Button onClick={() => navigate("/products")}>Go Back</Button>
            </div>
        );
    }

    if (!productData) return null;

    const {
        product = {},
        manufacturer = {},
        warehouse = {},
        types = [],
        orders = [],
        total_ordered = 0,
    } = productData;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/products")}
                        className="flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={handleEdit}
                            className="flex items-center"
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                            className="flex items-center"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Product Overview Card */}
                <Card className="shadow-lg">
                    {/* Rest of the component remains the same */}
                    <CardHeader className="border-b bg-gray-50">
                        <div className="flex items-center space-x-2">
                            <Package className="h-6 w-6 text-blue-500" />
                            <div>
                                <CardTitle className="text-2xl">{product.name}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                    <Factory className="h-4 w-4 mr-1" />
                                    {manufacturer.name} ({manufacturer.country})
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    ${product.price}
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Tag className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-600">Types: </span>
                                        <div className="flex flex-wrap gap-2">
                                            {types.map((type) => (
                                                <span
                                                    key={type}
                                                    className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ShoppingCart className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-600">Total Ordered: </span>
                                        <span className="font-semibold">{total_ordered}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <Warehouse className="h-5 w-5 text-gray-500 mr-2" />
                                    <h3 className="font-semibold">Warehouse Details</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Location:</span> {warehouse.location}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Capacity:</span> {warehouse.capacity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                            Order History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.length > 0 ? (
                            <div className="grid gap-4">
                                {orders.map((order) => (
                                    <div
                                        key={order.order_id}
                                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID</p>
                                                <p className="font-medium">{order.order_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Amount</p>
                                                <p className="font-medium">{order.amount}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Arrival Date</p>
                                                <p className="font-medium">{order.arrival_date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No orders available for this product.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {product.name}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProductInfo;