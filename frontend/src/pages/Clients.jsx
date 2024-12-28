import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table"; // Assuming you have a table component
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom"; // Assuming you have a button component

const ClientsPage = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch clients data on component mount
    useEffect(() => {
        fetch("http://localhost:8080/api/data/clients")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch clients data");
                }
                return response.json();
            })
            .then((data) => {
                setClients(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Clients Data</h1>

            {/* Clients Table */}
            <Table className="mt-4 w-full">
                <TableHeader>
                    <TableRow>
                        <TableCell>Client ID</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Client Name</TableCell>
                        <TableCell>Client Balance</TableCell>
                        <TableCell>Total Order Amount</TableCell>
                        <TableCell>Number of Orders</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.client_id}>
                            <TableCell>{client.client_id}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.client_name}</TableCell>
                            <TableCell>${client.client_balance.toFixed(2)}</TableCell>
                            <TableCell>${client.total_order_amount.toFixed(2)}</TableCell>
                            <TableCell>{client.number_of_orders}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Back Button */}
            <Button className="mt-4" onClick={()=>{navigate("/")}}>Go Back</Button>
        </div>
    );
};

export default ClientsPage;
