export interface ISalesOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  room: { 
    name: string; 
    property: { name: string } 
  };
  user: { 
    fullName: string; 
    email: string 
  };
}

export interface ISalesData {
  data: ISalesOrder[];
  summary: { 
    totalRevenue: number; 
    totalTransactions: number;
  };
}

export interface ICalendarOrder {
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

export interface IRoomCalendar {
  id: string;
  name: string;
  property: { 
    name: string; 
    city: string;
  };
  orders: ICalendarOrder[];
}