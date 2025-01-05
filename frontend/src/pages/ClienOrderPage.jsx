import React, {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "@/components/ui/accordion";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Package,
    User,
    DollarSign,
    Calendar,
    ArrowLeft,
    Search,
    Loader2,
    MapPin,
    ShoppingCart,
    ChevronDown,
    ChevronRight
} from "lucide-react";

const OrderCard = ({order, expanded, onToggle}) => {
    const navigate = useNavigate();
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const totalAmount = order.products.reduce(
        (sum, p) => sum + (p.product_price * p.product_amount),
        0
    );

    return (
        <Card className="my-2 transition-all duration-200 shadow-md hover:shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-6 w-6"
                            onClick={onToggle}
                        >
                            {expanded ?
                                <ChevronDown className="h-5 w-5"/> :
                                <ChevronRight className="h-5 w-5"/>
                            }
                        </Button>
                        <CardTitle className="text-lg">Order #{order.order_id}</CardTitle>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{formatCurrency(totalAmount)}</p>
                        <p className="text-sm text-gray-500">{order.products.length} items</p>
                    </div>
                </div>
                <CardDescription>
                    Processed on {formatDate(order.order_date)}
                </CardDescription>
            </CardHeader>
            {expanded && (
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600"/>
                                <div>
                                    <p className="text-sm text-gray-500">Processed by</p>
                                    <p className="font-medium">{order.worker?.name || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-purple-600"/>
                                <div>
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-medium">{formatDate(order.order_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-green-600"/>
                                <div>
                                    <p className="text-sm text-gray-500">Total Items</p>
                                    <p className="font-medium">{order.products.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-medium mb-3">Order Items</h4>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell className="font-medium">Product</TableCell>
                                            <TableCell className="font-medium">Quantity</TableCell>
                                            <TableCell className="font-medium">Price</TableCell>
                                            <TableCell className="font-medium">Manufacturer</TableCell>
                                            <TableCell className="font-medium">Location</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.products?.map((product, index) => (
                                            <TableRow onClick={() => {
                                                navigate(`/product/${product.product_name}`)
                                            }}
                                                      key={index}
                                                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                                            >
                                                <TableCell className="font-medium">{product.product_name}</TableCell>
                                                <TableCell>{product.product_amount}</TableCell>
                                                <TableCell>{formatCurrency(product.product_price)}</TableCell>
                                                <TableCell>{product.manufacturer?.name || "N/A"}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-500"/>
                                                        <span>{product.warehouse?.location || "N/A"}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

const ClientOrdersPage = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const navigate = useNavigate();

    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedOrders, setExpandedOrders] = useState(new Set());

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
                    if (data.client_data.orders.length > 0) {
                        setClientData(data.client_data);
                        // Expand the first order by default
                        setExpandedOrders(new Set([data.client_data.orders[0].order_id]));
                    } else {
                        setClientData(null);
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

    const toggleOrder = (orderId) => {
        setExpandedOrders(prev => {
            const next = new Set(prev);
            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }
            return next;
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500"/>
                <p className="text-lg text-gray-600">Loading order history...</p>
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

    if (!clientData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Package className="h-16 w-16 text-gray-400"/>
                <p className="text-xl text-gray-600">No orders found for this email</p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const filteredOrders = clientData.orders.filter(order =>
        order.products.some(product =>
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Back
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold mb-6 flex items-center">
                        <ShoppingCart className="h-8 w-8 mr-3 text-blue-500"/>
                        Order History
                    </h1>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500"/>
                                    <CardTitle>Client Details</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{clientData.client_info?.name || "N/A"}</p>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{clientData.client_info?.email || "N/A"}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-500"/>
                                    <CardTitle>Available Balance</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-2xl font-bold text-green-600">
                                        ${clientData.client_info?.money?.toLocaleString() || "0"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-purple-500"/>
                                    <CardTitle>Total Orders</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-2xl font-bold">
                                        {clientData.orders?.length || 0}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.order_id}
                                order={order}
                                expanded={expandedOrders.has(order.order_id)}
                                onToggle={() => toggleOrder(order.order_id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientOrdersPage;