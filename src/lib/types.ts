
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string; 
    createdAt: Date;
    orders?: Order[];
}


export interface Product {
    id: number;
    title: string;
    description?: string | null;
    price: number;
    stock: number;
    createdAt: Date;
    orders?: OrderItem[]; 
}


export interface Order {
    id: number;
    userId: number;
    status: string; 
    total: number;
    createdAt: Date;
    user?: User;      
    items?: OrderItem[]; 
}


export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    order?: Order;      
    product?: Product;  
}