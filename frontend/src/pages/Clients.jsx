import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Search,
    ArrowLeft,
    Plus,
    Loader2,
    ArrowUpDown,
    Mail,
    DollarSign,
    PackageCheck,
    Download
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const ClientsPage = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [stats, setStats] = useState({
        totalClients: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0
    });

    useEffect(() => {
        fetch("http://localhost:8080/api/data/clients")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch clients data");
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length) {
                    setClients(data);
                    calculateStats(data);
                } else {
                    setError("No clients data found");
                }
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const calculateStats = (clientsData) => {
        const stats = clientsData.reduce((acc, client) => ({
            totalClients: acc.totalClients + 1,
            totalOrders: acc.totalOrders + client.number_of_orders,
            totalRevenue: acc.totalRevenue + client.total_order_amount,
            averageOrderValue: acc.totalRevenue / acc.totalOrders
        }), {
            totalClients: 0,
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0
        });
        setStats(stats);
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const sortedClients = [...clients].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const filteredClients = sortedClients.filter(client =>
        client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-lg text-gray-600">Loading client data...</p>
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
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {/* Export logic */}}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => navigate('/clients/new')}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Client
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold flex items-center">
                            <Users className="h-8 w-8 mr-3 text-blue-500" />
                            Clients
                        </h1>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Total Clients</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.totalClients}</p>
                            </CardContent>
                        </Card>
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
                                <CardTitle className="text-sm text-gray-500">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Avg Order Value</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="rounded-lg border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell onClick={() => handleSort('client_id')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            ID
                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('email')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            <Mail className="mr-2 h-4 w-4" />
                                            Email
                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('client_name')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            Name
                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('client_balance')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Balance
                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('total_order_amount')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            Total Orders
                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort('number_of_orders')} className="cursor-pointer">
                                        <div className="flex items-center">
                                            <PackageCheck className="mr-2 h-4 w-4" />
                                            Orders
                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((client) => (
                                    <TableRow key={client.client_id} className="hover:bg-gray-50">
                                        <TableCell>{client.client_id}</TableCell>
                                        <TableCell className="font-medium">{client.email}</TableCell>
                                        <TableCell>{client.client_name}</TableCell>
                                        <TableCell className={client.client_balance < 0 ? 'text-red-600' : 'text-green-600'}>
                                            ${client.client_balance.toFixed(2)}
                                        </TableCell>
                                        <TableCell>${client.total_order_amount.toFixed(2)}</TableCell>
                                        <TableCell>{client.number_of_orders}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={client.number_of_orders === 0}
                                                onClick={() => navigate(`/orders?email=${client.email}`)}
                                            >
                                                View Orders
                                            </Button>
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

export default ClientsPage;