export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  DAILY_SALES_SUMMARY = 'DAILY_SALES_SUMMARY',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  RAFFLE_UPDATED = 'RAFFLE_UPDATED',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}