export type BasicUserInfo = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'tenant';
}

export type RegisterInfo = {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  role: 'manager' | 'tenant';
}