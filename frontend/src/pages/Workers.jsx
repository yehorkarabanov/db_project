import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";

const App = () => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        // Fetch data from API
        axios.get('http://localhost:8080/api/data/workers')
            .then((response) => {
                setWorkers(response.data.json_build_object.workers);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const renderSubordinates = (subordinates) => {
        if (!subordinates || subordinates.length === 0) return null;

        return (
            <ul className="ml-4">
                {subordinates.map((subordinate) => (
                    <li key={subordinate.id}>
                        <Card className="my-2">
                            <CardHeader>
                                <CardTitle>{subordinate.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Salary: ${subordinate.salary}</p>
                                <p>Orders Count: {subordinate.orders_count}</p>
                                <p>Warehouse ID: {subordinate.warehouse_id}</p>
                            </CardContent>
                        </Card>
                        {renderSubordinates(subordinate.subordinates)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Workers</h1>
            <ul>
                {workers.map((worker) => (
                    <li key={worker.id}>
                        <Card className="my-4">
                            <CardHeader>
                                <CardTitle>{worker.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Salary: ${worker.salary}</p>
                                <p>Orders Count: {worker.orders_count}</p>
                                <p>Warehouse ID: {worker.warehouse_id}</p>
                            </CardContent>
                        </Card>
                        {renderSubordinates(worker.subordinates)}
                    </li>
                ))}
            </ul>
            <Button className="mt-4" onClick={() => {
                navigate(-1)
            }}>Go Back</Button>
        </div>
    );
};

export default App;
