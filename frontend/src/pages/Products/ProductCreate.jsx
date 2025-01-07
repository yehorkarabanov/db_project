import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Package,
    ArrowLeft,
    Factory,
    Warehouse,
    Tag,
    Loader2,
    AlertCircle,
    Plus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const ProductCreation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
    const [newType, setNewType] = useState({ name: "" });
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        place_taken: "",
        warehouse_id: "",
        manufacturer_id: "",
        types: []
    });
    const [formOptions, setFormOptions] = useState({
        manufacturers: [],
        warehouses: [],
        types: []
    });

    useEffect(() => {
        fetchFormData();
    }, []);

    const fetchFormData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/products/data/");
            setFormOptions(response.data.result);
            setLoading(false);
        } catch (err) {
            setError("Failed to load form data. Please try again.");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypesChange = (typeId) => {
        setFormData(prev => {
            const types = prev.types.includes(typeId)
                ? prev.types.filter(id => id !== typeId)
                : [...prev.types, typeId];
            return { ...prev, types };
        });
    };

    const handleNewTypeSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event from bubbling up to product form
        setTypeError("");

        try {
            const response = await axios.post("http://localhost:8080/api/types/", newType);
            setFormOptions(prev => ({
                ...prev,
                types: [...prev.types, response.data]
            }));
            setNewType({ name: "" });
            setIsTypeDialogOpen(false);
        } catch (err) {
            setTypeError("Failed to create new type. Please try again.");
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post("http://localhost:8080/api/products/", formData);
            navigate("/products");
        } catch (err) {
            setError("Failed to create product. Please try again.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-lg text-gray-600">Loading form...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-3xl font-bold">
                            <Package className="h-8 w-8 mr-3 text-blue-500" />
                            Create New Product
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProductSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Product Name
                                    </label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Price ($)
                                        </label>
                                        <Input
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Space Required (units)
                                        </label>
                                        <Input
                                            name="place_taken"
                                            type="number"
                                            value={formData.place_taken}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center">
                                        <Factory className="h-4 w-4 mr-2" />
                                        Manufacturer
                                    </label>
                                    <select
                                        className="w-full border rounded-md p-2"
                                        value={formData.manufacturer_id}
                                        onChange={(e) => handleSelectChange("manufacturer_id", e.target.value)}
                                        required
                                    >
                                        <option value="">Select manufacturer</option>
                                        {formOptions.manufacturers.map((manufacturer) => (
                                            <option key={manufacturer.id} value={manufacturer.id}>
                                                {manufacturer.name} ({manufacturer.country})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center">
                                        <Warehouse className="h-4 w-4 mr-2" />
                                        Warehouse
                                    </label>
                                    <select
                                        className="w-full border rounded-md p-2"
                                        value={formData.warehouse_id}
                                        onChange={(e) => handleSelectChange("warehouse_id", e.target.value)}
                                        required
                                    >
                                        <option value="">Select warehouse</option>
                                        {formOptions.warehouses.map((warehouse) => (
                                            <option key={warehouse.id} value={warehouse.id}>
                                                {warehouse.location} (Capacity: {warehouse.capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium flex items-center">
                                            <Tag className="h-4 w-4 mr-2" />
                                            Product Types
                                        </label>
                                        <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Type
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent onClick={(e) => e.stopPropagation()}>
                                                <DialogHeader>
                                                    <DialogTitle>Add New Product Type</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    {typeError && (
                                                        <Alert variant="destructive" className="mb-4">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <AlertDescription>{typeError}</AlertDescription>
                                                        </Alert>
                                                    )}
                                                    <form onSubmit={handleNewTypeSubmit} className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">
                                                                Type Name
                                                            </label>
                                                            <Input
                                                                value={newType.name}
                                                                onChange={(e) => setNewType({ name: e.target.value })}
                                                                placeholder="Enter type name"
                                                                required
                                                            />
                                                        </div>
                                                        <Button
                                                            type="submit"
                                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Create Type
                                                        </Button>
                                                    </form>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {formOptions.types.map((type) => (
                                            <label
                                                key={type.id}
                                                className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.types.includes(type.id.toString())}
                                                    onChange={() => handleTypesChange(type.id.toString())}
                                                    className="rounded border-gray-300"
                                                />
                                                <span>{type.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Product...
                                    </>
                                ) : (
                                    "Create Product"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductCreation;