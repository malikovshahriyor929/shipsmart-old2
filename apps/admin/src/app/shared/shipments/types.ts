export type ShipmentParty = {
  name: string;
  aljexId?: string;
  mcNumber?: string;
  dotNumber?: string;
  scacNumber?: string;
  email?: string;
  phone?: string;
};

export type ShipmentListItem = {
  pro: number;
  loadDescription: string;
  status: string;
  mode: string;
  customerTotal: number;
  carrierTotal: number;
  customer: ShipmentParty;
  carrier: ShipmentParty | null;
};

export type ShipmentStop = {
  stopNumber: number;
  type: 'pickup' | 'delivery';
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  date?: string;
  hours?: string;
  notes?: string;
};

export type ShipmentDriver = {
  name: string;
  phone?: string;
  email?: string;
};

export type MacroPointLoad = {
  orderStatus?: string;
  orderHyperlink: string;
  truckTrailerNumber?: string;
  driverCell?: string;
  trackStartDate?: string;
  trackStartTime?: string;
  trackStartTimezone?: string;
  trackingDuration?: number;
  trackingInterval?: string;
  lastUpdated?: string;
};

export type ShipmentDetail = ShipmentListItem & {
  equipmentCode?: string;
  equipmentDescription?: string;
  customerMiles?: number;
  truckMiles?: number;
  weight?: number;
  billableWeight?: number;
  pieces?: number;
  dispatcher?: string;
  truckNumber?: string;
  customerReference?: string;
  grossProfit: number;
  netMargin: number;
  createdAt?: string;
  updatedAt?: string;
  specialInstructions?: string;
  billOfLadingNotes?: string;
  stops: ShipmentStop[];
  drivers: ShipmentDriver[];
  requirements: string[];
  macroPointLoad?: MacroPointLoad;
  rawPayload?: unknown;
};

export type ShipmentDataSource = 'api' | 'demo';
