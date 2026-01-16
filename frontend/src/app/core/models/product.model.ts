// Modelo que representa un producto
export enum ProductSize {
  Size7 = 7,
  Size8 = 8,
  Size9 = 9,
  Size10 = 10
}

// Modelo que representa un color de producto
export enum ProductColor {
  White = 1,
  Black = 2,
  Gray = 3
}

// Modelo que representa un producto  
export interface Product {
  id: string;
  code: string;
  imageUrl: string;
  name: string;
  description: string;
  size: ProductSize;
  sizeDisplay: string;
  color: ProductColor;
  colorDisplay: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}

// Modelo para crear un nuevo producto
export interface CreateProductRequest {
  code: string;
  imageUrl: string;
  name: string;
  description: string;
  size: ProductSize;
  color: ProductColor;
  price: number;
  stock: number;
}

// Modelo para actualizar un producto existente
export interface UpdateProductRequest {
  code: string;
  imageUrl: string;
  name: string;
  description: string;
  size: ProductSize;
  color: ProductColor;
  price: number;
  stock: number;
}
