export type Task = {
  id: number;
  list_id: number;
  title: string;
  description?: string;
  due_date?: Date;
  is_completed: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type Tasks = Task[];
