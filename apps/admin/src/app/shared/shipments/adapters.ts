import type {
  ShipmentDetail,
  ShipmentDriver,
  ShipmentListItem,
  ShipmentParty,
  ShipmentStop,
} from './types';

type JsonRecord = Record<string, unknown>;

const REQUIREMENT_LABELS: Array<[string, string]> = [
  ['req_hazmat', 'Hazmat'],
  ['req_temp', 'Temperature control'],
  ['req_pre_cooled', 'Pre-cooled trailer'],
  ['req_lift_gate_pickup', 'Pickup lift gate'],
  ['req_lift_gate_delivery', 'Delivery lift gate'],
  ['req_inside_pickup', 'Inside pickup'],
  ['req_inside_delivery', 'Inside delivery'],
  ['req_pallet_exchange', 'Pallet exchange'],
  ['req_tarp', 'Tarp'],
  ['req_permits', 'Permits'],
  ['req_oversized', 'Oversized'],
  ['req_escorts', 'Escorts'],
  ['req_FSMA', 'FSMA'],
  ['req_seal', 'Seal'],
  ['req_straps_chains', 'Straps / chains'],
  ['req_teams', 'Team drivers'],
  ['req_labor', 'Labor'],
  ['req_customs_bonded', 'Customs bonded'],
];

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
}

function optionalString(value: unknown): string | undefined {
  const normalized = asString(value);
  return normalized || undefined;
}

function normalizeMacroPointUrl(value: unknown): string | undefined {
  const normalized = asString(value);
  if (!normalized) return undefined;

  try {
    const url = new URL(normalized);
    const hostname = url.hostname.toLowerCase();
    const isMacroPointHost =
      hostname === 'macropoint-lite.com' ||
      hostname.endsWith('.macropoint-lite.com');

    return url.protocol === 'https:' && isMacroPointHost
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function asNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const normalized = Number.parseFloat(asString(value));
  return Number.isFinite(normalized) ? normalized : 0;
}

function optionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const normalized = asNumber(value);
  return Number.isFinite(normalized) ? normalized : undefined;
}

function firstValue(...values: unknown[]) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== ''
  );
}

function normalizeParty(value: unknown): ShipmentParty {
  const party = asRecord(value);
  return {
    name: asString(party.name) || 'Unassigned',
    aljexId: optionalString(firstValue(party.aljex_id, party.vision_id)),
    mcNumber: optionalString(party.mc_num),
    dotNumber: optionalString(party.dot_num),
    scacNumber: optionalString(party.scac_num),
    email: optionalString(party.email),
    phone: optionalString(party.phone),
  };
}

export function normalizeShipmentListItem(value: unknown): ShipmentListItem {
  const shipment = asRecord(value);
  const carrier = shipment.carrier ? normalizeParty(shipment.carrier) : null;

  return {
    pro: asNumber(shipment.pro),
    loadDescription:
      asString(shipment.load_description) || 'No description provided',
    status: asString(shipment.status).toUpperCase() || 'UNKNOWN',
    mode: asString(shipment.mode).toUpperCase() || 'UNKNOWN',
    customerTotal: asNumber(shipment.customer_total_rates),
    carrierTotal: asNumber(shipment.carrier_total_rates),
    customer: normalizeParty(shipment.customer),
    carrier,
  };
}

export function normalizeShipmentListResponse(payload: unknown) {
  const root = asRecord(payload);
  const content = asRecord(root.content);
  const rows = Array.isArray(payload)
    ? payload
    : firstValue(content.shipments, root.shipments, root.data);

  return asArray(rows)
    .map(normalizeShipmentListItem)
    .filter((shipment) => shipment.pro > 0);
}

function normalizeStop(value: unknown): ShipmentStop {
  const stop = asRecord(value);
  const location = asRecord(stop.location);
  const rawType = asString(stop.event_type).toUpperCase();

  return {
    stopNumber: asNumber(stop.stop_num),
    type: rawType === 'D' ? 'delivery' : 'pickup',
    name:
      asString(firstValue(stop.name, stop.location_name, location.name)) ||
      (rawType === 'D' ? 'Delivery' : 'Pickup'),
    address: asString(firstValue(location.address, stop.address)),
    city: asString(firstValue(location.city, stop.city)),
    state: asString(firstValue(location.state, stop.state)),
    zip: asString(firstValue(location.zip, stop.zip)),
    date: optionalString(
      firstValue(
        stop.ready_or_deliver,
        stop.ready_or_deliver_date,
        stop.appt_start,
        stop.appt_start_date
      )
    ),
    hours: optionalString(firstValue(stop.hours, stop.ready_or_deliver_time)),
    notes: optionalString(stop.notes),
  };
}

function normalizeDriver(
  load: JsonRecord,
  index: 1 | 2
): ShipmentDriver | null {
  const name = optionalString(load[`driver_${index}_ref_driver`]);
  if (!name) return null;

  return {
    name,
    phone: optionalString(load[`driver_${index}_cell`]),
    email: optionalString(load[`driver_${index}_email`]),
  };
}

function directStops(shipment: JsonRecord): ShipmentStop[] {
  const pickupCity = asString(shipment.pickup_city);
  const consigneeCity = asString(shipment.cons_city);
  if (!pickupCity && !consigneeCity) return [];

  return [
    {
      stopNumber: 1,
      type: 'pickup',
      name: asString(shipment.pickup_name) || 'Pickup',
      address: '',
      city: pickupCity,
      state: asString(shipment.pickup_state),
      zip: asString(shipment.pickup_zip),
      date: optionalString(
        firstValue(shipment.pickup_appt, shipment.ready_date)
      ),
    },
    {
      stopNumber: 2,
      type: 'delivery',
      name: asString(shipment.cons_name) || 'Delivery',
      address: '',
      city: consigneeCity,
      state: asString(shipment.cons_state),
      zip: asString(shipment.cons_zip),
      date: optionalString(shipment.cons_appt),
    },
  ];
}

export function normalizeShipmentDetailResponse(
  payload: unknown,
  fallback?: ShipmentListItem
): ShipmentDetail {
  const root = asRecord(payload);
  const content = asRecord(root.content);
  const nestedShipment = asRecord(
    firstValue(content.shipment, root.shipment, root.data)
  );
  const isAljexShape = Object.keys(asRecord(root.load_info)).length > 0;
  const shipment = isAljexShape
    ? { ...asRecord(root.load_info), ...root }
    : nestedShipment;
  const load = isAljexShape ? asRecord(root.load_info) : shipment;
  const instruction = asRecord(
    firstValue(root.instruction, shipment.instruction)
  );
  const macroPointLoad = asRecord(
    firstValue(
      root.macropoint_load,
      content.macropoint_load,
      shipment.macropoint_load,
      nestedShipment.macropoint_load,
      load.macropoint_load
    )
  );
  const macroPointUrl = normalizeMacroPointUrl(
    macroPointLoad.order_hyperlink
  );

  const customer = firstValue(
    shipment.customer,
    root.customer,
    load.stored_customer
  );
  const carrier = firstValue(
    shipment.carrier,
    root.carrier,
    load.stored_carrier
  );

  const customerTotal = asNumber(
    firstValue(
      shipment.customer_total_rates,
      load.customer_total_rates,
      load.last_saved_total_customer_rate,
      load.rate_customer_line_haul_rate,
      fallback?.customerTotal
    )
  );
  const carrierTotal = asNumber(
    firstValue(
      shipment.carrier_total_rates,
      load.carrier_total_rates,
      load.rate_carrier_line_haul_rate,
      fallback?.carrierTotal
    )
  );
  const stopsSource = firstValue(shipment.pick_stops, root.pick_stops);
  const stops = asArray(stopsSource).map(normalizeStop);
  const drivers = ([1, 2] as const)
    .map((index) => normalizeDriver(load, index))
    .filter((driver): driver is ShipmentDriver => driver !== null);
  const grossProfit =
    optionalNumber(shipment.gross_profit) ?? customerTotal - carrierTotal;
  const netMargin =
    optionalNumber(shipment.net_margin) ??
    (customerTotal > 0 ? grossProfit / customerTotal : 0);

  return {
    pro: asNumber(firstValue(shipment.pro, root.pro, load.pro, fallback?.pro)),
    loadDescription:
      asString(
        firstValue(
          shipment.load_description,
          load.load_description,
          fallback?.loadDescription
        )
      ) || 'No description provided',
    status:
      asString(
        firstValue(shipment.status, root.status, load.status, fallback?.status)
      ).toUpperCase() || 'UNKNOWN',
    mode:
      asString(
        firstValue(shipment.mode, load.mode, fallback?.mode)
      ).toUpperCase() || 'UNKNOWN',
    customerTotal,
    carrierTotal,
    customer: customer
      ? normalizeParty(customer)
      : (fallback?.customer ?? { name: 'Unassigned' }),
    carrier: carrier ? normalizeParty(carrier) : (fallback?.carrier ?? null),
    equipmentCode: optionalString(load.equipment_type_code),
    equipmentDescription: optionalString(load.equipment_type_description),
    customerMiles: optionalNumber(load.miles_customer),
    truckMiles: optionalNumber(load.miles_truck),
    weight: optionalNumber(load.weight),
    billableWeight: optionalNumber(load.weight_billable),
    pieces: optionalNumber(load.pieces),
    dispatcher: optionalString(load.dispatcher),
    truckNumber: optionalString(load.truck_num),
    customerReference: optionalString(load.customer_ref_num),
    grossProfit,
    netMargin,
    createdAt: optionalString(load.created_at),
    updatedAt: optionalString(load.updated_at),
    specialInstructions: optionalString(
      firstValue(
        shipment.special_instructions,
        load.special_instructions,
        instruction.special_instructions
      )
    ),
    billOfLadingNotes: optionalString(
      firstValue(
        shipment.bill_of_lading_notes,
        load.bill_of_lading_notes,
        instruction.bill_of_lading_notes
      )
    ),
    stops: stops.length > 0 ? stops : directStops(shipment),
    drivers,
    requirements: REQUIREMENT_LABELS.filter(
      ([key]) => shipment[key] === true || load[key] === true
    ).map(([, label]) => label),
    macroPointLoad: macroPointUrl
      ? {
          orderStatus: optionalString(macroPointLoad.order_status),
          orderHyperlink: macroPointUrl,
          truckTrailerNumber: optionalString(
            macroPointLoad.truck_trailer_number
          ),
          driverCell: optionalString(macroPointLoad.driver_cell),
          trackStartDate: optionalString(
            macroPointLoad.track_start_time_date
          ),
          trackStartTime: optionalString(
            macroPointLoad.track_start_time_time
          ),
          trackStartTimezone: optionalString(
            macroPointLoad.track_start_time_tz
          ),
          trackingDuration: optionalNumber(
            macroPointLoad.tracking_duration
          ),
          trackingInterval: optionalString(
            macroPointLoad.tracking_interval
          ),
          lastUpdated: optionalString(macroPointLoad.last_updated),
        }
      : undefined,
    rawPayload: payload,
  };
}

export function shipmentListItemToDetail(
  shipment: ShipmentListItem
): ShipmentDetail {
  return {
    ...shipment,
    grossProfit: shipment.customerTotal - shipment.carrierTotal,
    netMargin:
      shipment.customerTotal > 0
        ? (shipment.customerTotal - shipment.carrierTotal) /
          shipment.customerTotal
        : 0,
    stops: [],
    drivers: [],
    requirements: [],
  };
}
