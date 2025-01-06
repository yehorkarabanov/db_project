import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';

const ProductCreationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    placeTaken: '',
    warehouseId: '',
    manufacturerId: '',
    types: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOptions, setFormOptions] = useState({
    manufacturers: [],
    warehouses: [],
    types: []
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products/data/');
      setFormOptions(response.data.result);
      setLoading(false);
    } catch (err) {
      setError('Failed to load form data. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypesChange = (typeId) => {
    setFormData(prev => {
      const types = prev.types.includes(typeId)
        ? prev.types.filter(id => id !== typeId)
        : [...prev.types, typeId];
      return { ...prev, types };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Add your submit API endpoint here
      await axios.post('http://localhost:8080/api/products/', formData);
      // Handle success (e.g., redirect or show success message)
    } catch (err) {
      setError('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeTaken">Space Required</Label>
              <Input
                id="placeTaken"
                name="placeTaken"
                type="number"
                value={formData.placeTaken}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Select
              onValueChange={(value) => handleSelectChange('manufacturerId', value)}
              value={formData.manufacturerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                    {manufacturer.name} ({manufacturer.country})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warehouse">Warehouse</Label>
            <Select
              onValueChange={(value) => handleSelectChange('warehouseId', value)}
              value={formData.warehouseId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                    {warehouse.location} (Capacity: {warehouse.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Product Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {formOptions.types.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`type-${type.id}`}
                    checked={formData.types.includes(type.id.toString())}
                    onChange={() => handleTypesChange(type.id.toString())}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`type-${type.id}`}>{type.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductCreationForm;