import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import type { ComponentType } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { formatDistanceToNow, differenceInHours, differenceInDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function getDeviceIcon(userAgent: string): ComponentType<{ className?: string }> {
  const ua = userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('android') || ua.includes('mobile')) {
    return Smartphone;
  }
  if (ua.includes('ipad') || ua.includes('tablet') || ua.includes('kindle')) {
    return Tablet;
  }
  return Monitor;
}

export function getDeviceName(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('iphone')) return 'iPhone';
  if (ua.includes('ipad')) return 'iPad';
  if (ua.includes('android')) return ua.includes('mobile') ? 'Android Phone' : 'Android Tablet';
  if (ua.includes('windows')) return 'Windows PC';
  if (ua.includes('mac os')) return 'Mac';
  if (ua.includes('linux')) return 'Linux PC';
  return 'Unknown Device';
}

export function getBrowserName(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
  if (ua.includes('edg')) return 'Edge';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
  return 'Unknown Browser';
}

export function formatDate(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function formatExpiryDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const hours = differenceInHours(date, now);
  if (hours < 24) {
    return `Expires in ${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  const days = differenceInDays(date, now);
  return `Expires in ${days} day${days !== 1 ? 's' : ''}`;
}
