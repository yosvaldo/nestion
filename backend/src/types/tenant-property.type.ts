export interface CreatePropertyInput {
  name: string;
  categoryId: string;
  description?: string;
  city: string;
  address?: string;
  pictureUrls?: string[];
}

export interface UpdatePropertyInput {
  name?: string;
  categoryId?: string;
  description?: string;
  city?: string;
  address?: string;
}

export interface CreateRoomInput {
  name: string;
  description?: string;
  basePrice: number;
  guestCapacity?: number;
}

export interface UpdateRoomInput {
  name?: string;
  description?: string;
  basePrice?: number;
  guestCapacity?: number;
}