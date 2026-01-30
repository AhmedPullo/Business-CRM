export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

export interface InsertClient {
  name: string;
  email?: string;
  phone?: string;
}
