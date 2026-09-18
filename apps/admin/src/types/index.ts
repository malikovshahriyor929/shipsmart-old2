import { CouponType } from '@core/config/enums';

export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  slug: string;
  amount?: string;
  code?: string;
}

export interface Address {
  customerName?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  street?: string;
}

export interface GoogleMapLocation {
  lat?: number;
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export type ProductColor = {
  name?: string;
  code?: string;
};

export interface CartItem {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image: string;
  color?: ProductColor | null;
  price: number;
  salePrice?: number;
  quantity: number;
  size: number;
  stock?: number;
  discount?: number;
}

export type Product = {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  price: number;
  sale_price?: number;
  thumbnail: string;
  colors?: ProductColor[];
  sizes?: number[];
};

export type PosProduct = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  quantity: number;
  size: number;
  discount?: number;
};
export interface CalendarEvent {
  id?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
  description?: string;
  location?: string;
}

export interface FlightingCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  meta?: {
    model: string;
    hours: string;
    stop: string;
  };
  class: string;
  bucket: {
    luggage?: string;
    bag?: string;
  };
  airlines?: string;
  routes?: {
    arrivalDate: Date | string;
    arrivalTime: Date | string;
    departureDate: Date | string;
    departureTime: Date | string;
    departureCityCode: string;
    departureCity: string;
    departureTerminal: string;
    arrivalCityCode: string;
    arrivalCity: string;
    arrivalTerminal: string;
    layover: {
      layoverCityCode: string;
      layoverCity: string;
      layoverTerminal: string;
      layoverTime: string;
    }[];
  };
  cheapest?: boolean;
  best?: boolean;
  quickest?: boolean;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
}

export interface TaskData {
  id: string;
  title: string;
  assignedStudents: Student[];
  status: number; // percentage complete
  dueDate: Date;
  urgency: 'Urgent' | 'High' | 'Normal' | 'Low';
  submittedCount: number;
  totalAssigned: number;
}


export type LabeledValue<T = number> = {
  value: T;
  label: string;
};

export type Attachment = {
  public_id: string;
  file_name: string;
  extension: string;
  file_size: number;
  url: string;
  created_at: string; // ISO8601 or RFC3339 timestamp
};

export type Passport = {
  passport_number: string;
  passport_photo: Attachment;
  passport_file: Attachment;
  citizenship: LabeledValue<number>;
  nationality: LabeledValue<number>;
  pinfl: string;         // 14 digits
  given_place: string;
  expire_date: string;   // "DD.MM.YYYY"
  given_date: string;    // "DD.MM.YYYY"
};

export type School = {
  id: number;
  name: string;
  type: LabeledValue<number>;
  region: LabeledValue<number>;
  district: LabeledValue<number>;
  address: string;
  postal_code: string;
  phone_number: string;
  website_url: string;
};

export type AdvisorData = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  avatar: Attachment;
  status: LabeledValue<number>;
  preferred_lang: string;    // e.g. "Uzbek"
  date_of_birth: string;     // "DD.MM.YYYY"
  gender: LabeledValue<number>;
  role: LabeledValue<number>;
  last_login_at: string;     // e.g. "18.09.2025 10:22"
  passport: Passport;
  school: School;
};