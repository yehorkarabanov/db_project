import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    Users,
    Search,
    ArrowLeft,
    Plus,
    Loader2,
    Building,
    DollarSign,
    PackageCheck,
    ChevronDown,
    ChevronRight,
    UserPlus
} from "lucide-react";

const WorkerCard = ({ worker, level, expanded, onToggle, searchTerm }) => {
    const isHighlighted = searchTerm &&
        worker.name.toLowerCase().includes(searchTerm.toLowerCase());

    return (
        <Card className={`
            my-2 transition-all duration-200
            ${isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md hover:shadow-lg'}
            ${level > 0 ? 'ml-8' : ''}
        `}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {worker.subordinates?.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-6 w-6"
                                onClick={onToggle}
                            >
                                {expanded ?
                                    <ChevronDown className="h-5 w-5" /> :
                                    <ChevronRight className="h-5 w-5" />
                                }
                            </Button>
                        )}
                        <CardTitle className="text-lg">{worker.name}</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => {/* Add new subordinate logic */}}
                    >
                        <UserPlus className="h-4 w-4" />
                    </Button>
                </div>
                <CardDescription>
                    Reports to {level === 0 ? 'No One (Top Level)' : 'Superior'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-500">Salary</p>
                            <p className="font-medium">${worker.salary.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <PackageCheck className="h-4 w-4 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-500">Orders</p>
                            <p className="font-medium">{worker.orders_count}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-500">Warehouse</p>
                            <p className="font-medium">#{worker.warehouse_id}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const WorkerTree = ({ workers, level = 0, searchTerm }) => {
    const [expandedWorkers, setExpandedWorkers] = useState(new Set());

    const toggleWorker = (workerId) => {
        setExpandedWorkers(prev => {
            const next = new Set(prev);
            if (next.has(workerId)) {
                next.delete(workerId);
            } else {
                next.add(workerId);
            }
            return next;
        });
    };

    return (
        <div className="space-y-2">
            {workers.map((worker) => (
                <div key={worker.id}>
                    <WorkerCard
                        worker={worker}
                        level={level}
                        expanded={expandedWorkers.has(worker.id)}
                        onToggle={() => toggleWorker(worker.id)}
                        searchTerm={searchTerm}
                    />
                    {expandedWorkers.has(worker.id) && worker.subordinates && (
                        <WorkerTree
                            workers={worker.subordinates}
                            level={level + 1}
                            searchTerm={searchTerm}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

const WorkersPage = () => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/api/data/workers')
            .then((response) => {
                setWorkers(response.data.json_build_object.workers);
                setError(null);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError("Failed to load workers data. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-lg text-gray-600">Loading organization structure...</p>
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
            <div className="max-w-5xl mx-auto">
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
                        onClick={() => {/* Add new worker logic */}}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Worker
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold mb-6 flex items-center">
                        <Users className="h-8 w-8 mr-3 text-blue-500" />
                        Organization Structure
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search workers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <WorkerTree workers={workers} searchTerm={searchTerm} />
                </div>
            </div>
        </div>
    );
};

export default WorkersPage;