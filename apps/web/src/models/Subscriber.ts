export interface Subscriber {
  _id?: string;
  email: string;
  subscribedAt: Date;
  active: boolean;
  source?: string; // Where they subscribed from
  preferences?: {
    dailyDigest: boolean;
    weeklyNewsletter: boolean;
    specialAlerts: boolean;
  };
}

export function createSubscriber(email: string, source = 'website'): Omit<Subscriber, '_id'> {
  return {
    email: email.toLowerCase(),
    subscribedAt: new Date(),
    active: true,
    source,
    preferences: {
      dailyDigest: true,
      weeklyNewsletter: true,
      specialAlerts: false,
    },
  };
} 