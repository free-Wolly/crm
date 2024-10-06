export interface User {
  id: number;
  email: string;
  password?: string; // Optional because it won't be returned from the server
  role: 'ADMIN' | 'USER';
}

export interface Schedule {
  workday: string;
  workStartTime: string;
  workEndTime: string;
}

export interface Employee {
  id: number;
  name: string;
  phone: string;
  salary: number;
  schedules: Schedule[];
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
}