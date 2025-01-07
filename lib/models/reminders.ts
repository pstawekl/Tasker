export type Reminder = {
  id: number;
  task_id: number;
  reminder_time: Date;
  is_sent: boolean;
};

export type Reminders = Reminder[];
