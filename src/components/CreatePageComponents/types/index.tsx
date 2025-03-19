export interface OptionType {
  value: string;
  label: string;
}

export interface FormData {
  title: string;
  description?: string;
  department_id: string;
  responsible_employee_id: string;
  status_id: string;
  priority_id: string;
  due_date: string;
}