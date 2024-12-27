import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MainPage = () => {
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");

  const handleFindProduct = () => {
    console.log("Finding product for:", product);
    // Add logic for finding the product
  };

  const handleSeeOrders = () => {
    console.log("Fetching orders for:", email);
    // Add logic for fetching orders by email
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Product and Orders</h1>

      {/* Product Search Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Find Product</CardTitle>
          <CardDescription>Search for a product by its name.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="product">Product Name</Label>
              <Input
                id="product"
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <Button onClick={handleFindProduct}>Find Product</Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>See Orders</CardTitle>
          <CardDescription>View your orders by entering your email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <Button onClick={handleSeeOrders}>See Orders</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;
