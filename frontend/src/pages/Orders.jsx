import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import {
    Package,
    Search,
    ArrowLeft,
    Loader2,
    ArrowUpDown,
    Calendar,
    User,
    Mail,
    Download,
    Users, Plus
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});
    const [stats, setStats] = useState({
        totalOrders: 0,
        uniqueClients: 0,
        uniqueWorkers: 0,
        totalProducts: 0
    });

    useEffect(() => {
        axios.get("http://localhost:8080/api/data/orders")
            .then((response) => {
                if (Array.isArray(response.data) && response.data.length) {
                    setOrders(response.data);
                    calculateStats(response.data);
                } else {
                    setError("No orders data found");
                }
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const calculateStats = (ordersData) => {
        const stats = {
            totalOrders: ordersData.length,
            uniqueClients: new Set(ordersData.map(order => order.client_email)).size,
            uniqueWorkers: new Set(ordersData.map(order => order.worker_name)).size,
            totalProducts: ordersData.reduce((sum, order) => sum + order.products.length, 0)
        };
        setStats(stats);
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({key, direction});
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'data_arival') {
            return sortConfig.direction === 'asc'
                ? new Date(aValue) - new Date(bValue)
                : new Date(bValue) - new Date(aValue);
        }

        if (typeof aValue === 'string') {
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const filteredOrders = sortedOrders.filter(order =>
        order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(product =>
            product.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500"/>
                <p className="text-lg text-gray-600">Loading orders data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <p className="text-5xl">😞</p>
                <p className="text-2xl font-semibold mt-4">Sorry, {error}.</p>
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
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Back
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {/* Export logic */
                            }}
                        >
                            <Download className="h-4 w-4 mr-2"/>
                            Export
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => navigate('/orders/new')}
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Add Order
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold flex items-center">
                            <Package className="h-8 w-8 mr-3 text-blue-500"/>
                            Orders
                        </h1>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Total Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Unique Clients</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.uniqueClients}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Workers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.uniqueWorkers}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Total Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.totalProducts}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="rounded-lg border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell onClick={() => handleSort('id')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            ID
                                            <ArrowUpDown className="ml-1 h-4 w-4"/>
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('data_arival')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4"/>
                                            Date
                                            <ArrowUpDown className="ml-1 h-4 w-4"/>
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('worker_name')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4"/>
                                            Worker
                                            <ArrowUpDown className="ml-1 h-4 w-4"/>
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('client_name')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-4 w-4"/>
                                            Client
                                            <ArrowUpDown className="ml-1 h-4 w-4"/>
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('client_email')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            <Mail className="mr-2 h-4 w-4"/>
                                            Email
                                            <ArrowUpDown className="ml-1 h-4 w-4"/>
                                        </div>
                                    </TableCell>
                                    <TableCell>Products</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-gray-50">
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{new Date(order.data_arival).toLocaleDateString()}</TableCell>
                                        <TableCell>{order.worker_name}</TableCell>
                                        <TableCell
                                            className={"cursor-pointer"}
                                            onClick={() => {
                                                navigate(`/orders?email=${order.client_email}`)
                                            }}>{order.client_name}</TableCell>
                                        <TableCell className="font-medium cursor-pointer" onClick={() => {
                                            navigate(`/orders?email=${order.client_email}`)
                                        }}>{order.client_email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {order.products.map((product, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
                                                        onClick={() => {
                                                            navigate(`/products/${product}`)
                                                        }}
                                                    >
                                                        {product}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;