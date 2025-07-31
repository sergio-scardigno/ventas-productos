export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface PayPalOrder {
  id: string;
  status: string;
  intent: string;
  payment_source: {
    paypal: {
      account_id: string;
      account_type: string;
      name: {
        given_name: string;
        surname: string;
      };
      email_address: string;
    };
  };
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
    payee: {
      email_address: string;
    };
    shipping: {
      name: {
        full_name: string;
      };
      address: {
        address_line_1: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: string;
      };
    };
  }>;
}

export type PaymentMethod = 'mercadopago' | 'paypal'; 