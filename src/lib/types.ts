export type BasicUserInfo = {
  id: number,
  name: string,
  username: string,
  email: string,
  phone: string,
  role: 'admin' | 'manager' | 'tenant',
  status: 'active' | 'inactive',
}