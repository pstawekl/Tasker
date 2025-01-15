import { Reminder } from '../lib/models/reminders';
import { Task } from '../lib/models/tasks';

export class NotificationService {
  private static instance: NotificationService;
  private hasPermission: boolean = false;
  private reminderTimeouts: Map<string, number> = new Map();

  private constructor() {
    this.checkPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async checkPermission(): Promise<void> {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
    }
  }

  async scheduleTaskReminder(task: Task, reminder: Reminder): Promise<void> {
    if (!this.hasPermission) {
      await this.checkPermission();
    }

    if (!task.id || !reminder.reminder_time || !this.hasPermission) return;

    const reminderTime = new Date(reminder.reminder_time).getTime();
    const currentTime = new Date().getTime();
    const timeUntilReminder = reminderTime - currentTime;

    if (timeUntilReminder <= 0) return;

    const timeoutId = setTimeout(() => {
      new Notification('Task Reminder', {
        body: `Task "${task.title}" is due ${task.due_date ? `on ${new Date(task.due_date).toLocaleDateString()}` : 'soon'}`,
        icon: '/favicon.ico',
        tag: `task-${task.id}`,
        requireInteraction: true
      });
      this.reminderTimeouts.delete(task.id.toString());
    }, timeUntilReminder);

    this.reminderTimeouts.set(task.id.toString(), Number(timeoutId));
  }

  async cancelTaskReminder(taskId: string): Promise<void> {
    const timeoutId = this.reminderTimeouts.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.reminderTimeouts.delete(taskId);
    }
  }

  async updateTaskReminder(task: Task, reminder: Reminder): Promise<void> {
    await this.cancelTaskReminder(task.id.toString());
    await this.scheduleTaskReminder(task, reminder);
  }

  async deleteTaskReminder(taskId: string): Promise<void> {
    await this.cancelTaskReminder(taskId);
  }
}

export const notificationService = NotificationService.getInstance();
