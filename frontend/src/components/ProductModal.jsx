import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

const ProductModal = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected product.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p><strong>Product Name:</strong> {product.product_name}</p>
          <p><strong>Price:</strong> ${product.product_price}</p>
          <p><strong>Amount:</strong> {product.product_amount}</p>
          <p><strong>Manufacturer:</strong> {product.manufacturer.name} ({product.manufacturer.country})</p>
          <p><strong>Warehouse Location:</strong> {product.warehouse.location}</p>
          <p><strong>Types:</strong> {product.types.join(", ")}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
