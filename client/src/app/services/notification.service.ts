import { Injectable } from '@angular/core';

export interface NotificationMessage {
  id: number;
  type: 'success' | 'danger';
  message: string;
  delay?: number; 
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: NotificationMessage[] = [];
  private counter = 0;

  show(message: string, type: 'success' | 'danger', delay: number = 3000): void {
    this.counter++;
    const newNotification: NotificationMessage = {
      id: this.counter,
      type,
      message,
      delay
    };
    this.notifications.push(newNotification);


    setTimeout(() => this.remove(newNotification.id), delay);
  }

  remove(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}
