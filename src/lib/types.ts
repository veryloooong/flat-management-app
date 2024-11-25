export type BasicUserInfo = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "tenant";
  status: "active" | "inactive";
};

export type BasicFeeInfo = {
  id: number;
  name: string;
  amount: number;
  due_date: string;
  // type: 'monthly' | 'quarterly' | 'yearly',
  // status: 'active' | 'inactive',
};

export type DetailedFeeInfo = BasicFeeInfo & {
  is_required: boolean;
  created_at: string;
};

export type HouseholdInfo = {
  room_number: number;
  tenant_id: number;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
};

export type PersonalHouseholdInfo = BasicUserInfo & {
  room_number: number;
};

export type Notification = {
  id: number;
  from: string;
  to: string;
  content: string;
};
