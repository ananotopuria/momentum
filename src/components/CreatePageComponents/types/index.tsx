export type OptionType = {
  value: string;
  label: React.ReactNode;
};
export interface FormData {
  title: string;
  description?: string;
  department_id: string;
  responsible_employee_id: string;
  status_id: string;
  priority_id: string;
  due_date: string;
}