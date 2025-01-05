import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Package,
    Search,
    Factory,
    ArrowLeft,
    Tag,
    Loader2,
    Filter,
    Plus
} from "lucide-react";

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [allTypes, setAllTypes] = useState(new Set());

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:8080/api/data/products")
            .then((response) => {
                setProducts(response.data);
                // Extract all unique product types
                const types = new Set();
                response.data.forEach(product => {
                    product.product_types.forEach(type => types.add(type));
                });
                setAllTypes(types);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.manufacturer_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "all" || product.product_types.includes(selectedType);
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-lg text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <p className="text-lg text-red-500">{error}</p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <Button
                        onClick={() => navigate('/products/new')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold mb-6 flex items-center">
                        <Package className="h-8 w-8 mr-3 text-blue-500" />
                        Product List
                    </h1>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search products or manufacturers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select
                                className="border rounded-md p-2"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                {[...allTypes].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => (
                                <Card
                                    key={index}
                                    className="shadow-md hover:shadow-lg transition-shadow duration-200"
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span className="text-lg font-bold truncate">
                                                {product.product_name}
                                            </span>
                                            <span className="text-green-600 font-bold">
                                                ${product.product_price}
                                            </span>
                                        </CardTitle>
                                        <CardDescription className="flex items-center">
                                            <Factory className="h-4 w-4 mr-1" />
                                            {product.manufacturer_name} ({product.manufacturer_country})
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">Space:</span>
                                                <span className="font-medium">
                                                    {product.product_place_taken} units
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {product.product_types.map((type, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center"
                                                    >
                                                        <Tag className="h-3 w-3 mr-1" />
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full mt-4"
                                                onClick={() => navigate(`/products/${encodeURIComponent(product.product_name)}`)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No products found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;