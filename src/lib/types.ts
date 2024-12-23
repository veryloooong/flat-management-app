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
  recurrence_type: "weekly" | "monthly" | "yearly" | null;
  fee_assignments: FeesRoomInfo[];
};

export type HouseholdInfo = {
  room_number: number;
  tenant_id: number;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
};

export type FeesRoomInfo = {
  room_number: number;
  fee_id: number;
  fee_name: string;
  fee_amount: number;
  due_date: string;
  payment_date?: string;
  is_paid: boolean;
};

export type PersonalHouseholdInfo = {
  room_number: number;
  tenant_id: number;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
  fees: FeesRoomInfo[];
};

export type Notification = {
  id: number;
  title: string;
  message: string;
  created_at: string;
  from: string;
  to: string;
};
