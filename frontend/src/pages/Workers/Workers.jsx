import React, { useState, useEffect } from "react";
import axios from "axios";
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
    Loader2,
    ArrowUpDown,
    Building,
    DollarSign,
    Package,
    Plus,
    Pencil,
    Trash2,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

const WorkersPage = () => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedWorkers, setExpandedWorkers] = useState(new Set());
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState(null);
    const [stats, setStats] = useState({
        totalWorkers: 0,
        totalSalaries: 0,
        avgSalary: 0,
        totalOrders: 0,
    });

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = () => {
        setLoading(true);
        axios.get("http://localhost:8080/api/workers")
            .then((response) => {
                const workersData = response.data;
                setWorkers(workersData);
                calculateStats(workersData);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const calculateStats = (workersData) => {
        const totalWorkers = workersData.length;
        const totalSalaries = workersData.reduce((sum, worker) => sum + worker.salary, 0);
        const avgSalary = totalWorkers ? Math.round(totalSalaries / totalWorkers) : 0;
        const totalOrders = workersData.reduce((sum, worker) => sum + worker.orders_count, 0);

        setStats({ totalWorkers, totalSalaries, avgSalary, totalOrders });
    };

    const buildHierarchy = (workers) => {
        const workerMap = new Map();
        const rootWorkers = [];

        workers.forEach(worker => {
            worker.subordinates = [];
            workerMap.set(worker.name, worker);
        });

        workers.forEach(worker => {
            if (worker.supervisor) {
                const supervisor = workerMap.get(worker.supervisor);
                if (supervisor) {
                    supervisor.subordinates.push(worker);
                }
            } else {
                rootWorkers.push(worker);
            }
        });

        return rootWorkers;
    };

    const toggleExpand = (workerId) => {
        const newExpanded = new Set(expandedWorkers);
        if (newExpanded.has(workerId)) {
            newExpanded.delete(workerId);
        } else {
            newExpanded.add(workerId);
        }
        setExpandedWorkers(newExpanded);
    };

    const renderWorkerRow = (worker, level = 0) => {
        const hasSubordinates = worker.subordinates.length > 0;
        const isExpanded = expandedWorkers.has(worker.id);

        return (
            <React.Fragment key={worker.id}>
                <TableRow className="hover:bg-gray-50">
                    <TableCell>
                        <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
                            {hasSubordinates && (
                                <button
                                    onClick={() => toggleExpand(worker.id)}
                                    className="mr-2 focus:outline-none"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                            {worker.id}
                        </div>
                    </TableCell>
                    <TableCell>{worker.name}</TableCell>
                    <TableCell>${worker.salary}</TableCell>
                    <TableCell>{worker.orders_count}</TableCell>
                    <TableCell>{worker.warehouse_id}</TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/workers/edit/${worker.id}`)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteClick(worker)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
                {hasSubordinates && isExpanded && worker.subordinates.map(subordinate =>
                    renderWorkerRow(subordinate, level + 1)
                )}
            </React.Fragment>
        );
    };

    const handleDeleteClick = (worker) => {
        setWorkerToDelete(worker);
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!workerToDelete) return;

        setDeleteLoading(true);
        try {
            await axios.delete(`http://localhost:8080/api/workers/${workerToDelete.id}`);
            fetchWorkers();
            setShowDeleteDialog(false);
        } catch (error) {
            console.error("Error deleting worker:", error);
            setError("Failed to delete worker. Please try again later.");
        } finally {
            setDeleteLoading(false);
            setWorkerToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-lg text-gray-600">Loading workers data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <p className="text-5xl">😞</p>
                <p className="text-2xl font-semibold mt-4">Sorry, {error}.</p>
                <Button onClick={() => navigate("/workers/")}>Go Back</Button>
            </div>
        );
    }

    const rootWorkers = buildHierarchy(workers);
    const filteredWorkers = rootWorkers.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/workers/new')}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Worker
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold flex items-center">
                            <Users className="h-8 w-8 mr-3 text-blue-500" />
                            Workers
                        </h1>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search workers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Total Workers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.totalWorkers}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Total Salaries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">${stats.totalSalaries}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-500">Average Salary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">${stats.avgSalary}</p>
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
                    </div>

                    <div className="rounded-lg border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>Orders</TableCell>
                                    <TableCell>Warehouse</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWorkers.map(worker => renderWorkerRow(worker))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Worker</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete {workerToDelete?.name}?
                                This action cannot be undone.
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
        </div>
    );
};

export default WorkersPage;
