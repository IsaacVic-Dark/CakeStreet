export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'customer' | 'owner' | 'admin';
    avatar_url?: string;
    email_verified_at?: string;
}

export interface Bakery {
    id: string;
    owner_id: number;
    name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    cover_image_url?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    country: string;
    is_active: boolean;
}

export interface ProductSize {
    kg: number;
    price: number;
    serves: number;
}

export interface CustomizationOptions {
    messages?: boolean;
    photos?: boolean;
    decorations?: string[];
    color_themes?: string[];
}

export interface Product {
    id: string;
    bakery_id: string;
    name: string;
    slug: string;
    description?: string;
    category?: string;
    base_flavor?: string;
    available_sizes: ProductSize[];
    base_price: number;
    image_urls: string[];
    ingredients?: string[];
    allergens?: string[];
    is_eggless: boolean;
    is_sugar_free: boolean;
    customization_options?: CustomizationOptions;
    stock_quantity: number;
    is_available: boolean;
    is_featured: boolean;
    preparation_time_hours: number;
    average_rating?: number;
    bakery?: Bakery;
}

export interface DesignData {
    version?: number;
    canvas?: { width: number; height: number; backgroundColor: string };
    layers?: unknown[];
}

export interface CakeDesign {
    id: string;
    user_id: number;
    bakery_id?: string;
    name?: string;
    design_data: DesignData;
    preview_image_url?: string;
    thumbnail_url?: string;
    is_template: boolean;
    is_public: boolean;
    status: 'draft' | 'submitted' | 'quoted' | 'approved' | 'rejected';
    estimated_price?: number;
}

export interface CartItem {
    id: string;
    user_id?: number;
    product_id: string;
    product: Product;
    cake_design_id?: string;
    cake_design?: CakeDesign;
    customization?: {
        size?: ProductSize;
        message?: string;
        photo_url?: string;
    };
    quantity: number;
}

export interface OrderItem {
    id: string;
    product_name: string;
    product_snapshot: Product | Record<string, unknown>;
    customization?: Record<string, unknown>;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface Order {
    id: string;
    order_number: string;
    bakery_id: string;
    customer_id: number;
    order_type: 'catalog' | 'custom' | 'bulk';
    delivery_type: 'delivery' | 'pickup';
    delivery_address?: string;
    delivery_date?: string;
    delivery_time_slot?: string;
    subtotal: number;
    tax: number;
    discount: number;
    delivery_fee: number;
    total: number;
    status: string;
    payment_status: string;
    payment_method?: string;
    items: OrderItem[];
    created_at: string;
    bakery?: Bakery;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
};
