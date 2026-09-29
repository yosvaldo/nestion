export type OrderStatus = "MENUNGGU_PEMBAYARAN" | "MENUNGGU_KONFIRMASI_PEMBAYARAN" | "DIPROSES" | "DIBATALKAN";

export interface OrderItem {
  id: string;
  orderNumber: string;
  totalPrice: number;
  status: OrderStatus;
  checkInDate: string;
  checkOutDate: string;
  paymentProofUrl?: string;
  paymentExpiresAt: string;
  createdAt: string;
  room: {
    name: string;
    basePrice: number;
    property: {
      name: string;
      city: string;
      pictures: { pictureUrl: string }[];
    };
  };
}

export interface OrderMeta {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}