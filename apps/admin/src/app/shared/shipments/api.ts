import { axiosInstance } from '@/server/api';
import {
  normalizeShipmentDetailResponse,
  normalizeShipmentListResponse,
} from './adapters';
import type { ShipmentListItem } from './types';

const shipmentsPath = process.env.NEXT_PUBLIC_SHIPMENTS_PATH || '/v1/shipments';
const detailsPathTemplate =
  process.env.NEXT_PUBLIC_SHIPMENT_DETAILS_PATH || '/v1/shipments/{pro}';

export async function getShipments(signal?: AbortSignal) {
  const response = await axiosInstance.get<unknown>(shipmentsPath, {
    signal,
    timeout: 8_000,
  });
  return normalizeShipmentListResponse(response.data);
}

export async function getShipmentDetails(
  shipment: ShipmentListItem,
  signal?: AbortSignal
) {
  const path = detailsPathTemplate.replace('{pro}', String(shipment.pro));
  const response = await axiosInstance.get<unknown>(path, {
    signal,
    timeout: 8_000,
  });
  return normalizeShipmentDetailResponse(response.data, shipment);
}
