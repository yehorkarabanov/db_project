import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table"; // Assuming you have a table component
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom"; // Assuming you have a button component
import {NavLink} from "react-router";

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
                if (Array.isArray(data) && data.length) {
                    setClients(data);
                    setLoading(false);
                } else {
                    setError("no clients data found");
                    setLoading(false);
                }
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
        return (
            <div className="text-center mt-20">
                <p className="text-5xl">😞</p>
                <p className="text-2xl font-semibold mt-4">Sorry, {error}.</p>
                <Button onClick={() => {
                    navigate("/")
                }} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Clients Data</h1>

            {/* Clients Table */}
            <Table className="mt-4 w-full">
                <TableHeader>
                    <TableRow className={"pointer-events-none"}>
                        <TableCell>Client ID</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Client Name</TableCell>
                        <TableCell>Client Balance</TableCell>
                        <TableCell>Total Orders Amount</TableCell>
                        <TableCell>Number of Orders</TableCell>
                        <TableCell>Order Details</TableCell>
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
                            <TableCell><Button onClick={() => {
                                navigate(`/orders?email=${client.email}`)
                            }}>Details</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Back Button */}
            <Button className="mt-4" onClick={() => {
                navigate("/")
            }}>Go Back</Button>
        </div>
    );
};

export default ClientsPage;
