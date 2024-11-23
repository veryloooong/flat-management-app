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
