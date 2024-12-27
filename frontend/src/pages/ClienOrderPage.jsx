import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ProductModal from "@/components/ProductModal.jsx";

const ClientOrdersPage = () => {
  const clientData = {
    client_info: {
      email: "john.doe@example.com",
      name: "John Doe",
      money: 1500.75,
    },
    orders: [
      {
        order_id: 1,
        order_date: "2024-12-01",
        worker: {
          name: "Alice Johnson",
        },
        products: [
          {
            product_name: "Laptop",
            product_price: 800,
            product_amount: 2,
            manufacturer: {
              name: "New Name",
              country: "USA",
            },
            warehouse: {
              location: "New York, USA",
            },
            types: ["Electronics", "Electronics"],
          },
          {
            product_name: "Smartphone",
            product_price: 500,
            product_amount: 1,
            manufacturer: {
              name: "Global Electronics",
              country: "Germany",
            },
            warehouse: {
              location: "Berlin, Germany",
            },
            types: ["Electronics", "Furniture"],
          },
          {
            product_name: "Laptop",
            product_price: 800,
            product_amount: 2,
            manufacturer: {
              name: "New Name",
              country: "USA",
            },
            warehouse: {
              location: "New York, USA",
            },
            types: ["Electronics", "Electronics"],
          },
        ],
      },
      {
        order_id: 6,
        order_date: "2024-01-10",
        worker: {
          name: "Alice Johnson",
        },
        products: [
          {
            product_name: "Smartphone",
            product_price: 699.99,
            product_amount: 4,
            manufacturer: {
              name: "New Name",
              country: "USA",
            },
            warehouse: {
              location: "New York, USA",
            },
            types: ["Furniture"],
          },
        ],
      },
      {
        order_id: 7,
        order_date: "2024-02-15",
        worker: {
          name: "Alice Johnson",
        },
        products: [
          {
            product_name: "Table",
            product_price: 299.99,
            product_amount: 2,
            manufacturer: {
              name: "Global Electronics",
              country: "Germany",
            },
            warehouse: {
              location: "Berlin, Germany",
            },
            types: ["Electronics", "Toys"],
          },
        ],
      },
    ],
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Client Orders</h1>

      {/* Client Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p>
              <strong>Name:</strong> {clientData.client_info.name}
            </p>
            <p>
              <strong>Email:</strong> {clientData.client_info.email}
            </p>
            <p>
              <strong>Money Available:</strong> ${clientData.client_info.money}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Orders Accordion */}
      <Accordion type="single" collapsible>
        {clientData.orders.map((order) => (
          <AccordionItem key={order.order_id} value={`order-${order.order_id}`}>
            <AccordionTrigger>
              Order #{order.order_id} - {order.order_date}
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <p>
                  <strong>Worker:</strong> {order.worker.name}
                </p>

                {/* Product Table */}
                <Table className="mt-4 w-full">
                  <TableBody className={"font-bold"} >
                    <TableRow className={"pointer-events-none"}>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Manufacturer</TableCell>
                      <TableCell>Warehouse Location</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableBody>
                    {order.products.map((product, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleProductClick(product)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <TableCell>{product.product_name}</TableCell>
                        <TableCell>${product.product_price}</TableCell>
                        <TableCell>{product.product_amount}</TableCell>
                        <TableCell>{product.manufacturer.name}</TableCell>
                        <TableCell>{product.warehouse.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ClientOrdersPage;
