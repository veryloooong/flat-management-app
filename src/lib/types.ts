export type BasicUserInfo = {
  id: number,
  name: string,
  username: string,
  email: string,
  phone: string,
  role: 'admin' | 'manager' | 'tenant',
  status: 'active' | 'inactive',
}

export type FeeInfo = {
  id: number,
  name: string,
  amount: number,
  // type: 'monthly' | 'quarterly' | 'yearly',
  // status: 'active' | 'inactive',
}