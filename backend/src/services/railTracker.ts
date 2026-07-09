const VNB_LAT = 12.6833;
const VNB_LNG = 78.6167;
const APPROACH_KM = 5;
const CACHE_TTL = 60_000;

interface ApproachingTrain {
  trainName: string;
  trainNumber: string;
  direction: 'up' | 'down';
  distanceKm: number;
  lastUpdated: Date;
}

let cache: ApproachingTrain[] = [];
let lastFetch: Date | null = null;

const apiKey = () => process.env.RAILRADAR_API_KEY;
const apiUrl = () => process.env.RAILRADAR_API_URL || 'https://api.railradar.in/v1';

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseTrains(raw: any): ApproachingTrain[] {
  const trains: ApproachingTrain[] = [];
  const items = raw?.data ?? raw?.trains ?? raw?.results ?? [];
  if (!Array.isArray(items)) return trains;

  for (const item of items) {
    const lat = item?.lat ?? item?.latitude ?? item?.position?.latitude;
    const lng = item?.lng ?? item?.longitude ?? item?.position?.longitude;
    if (lat == null || lng == null) continue;

    const distance = haversineKm(VNB_LAT, VNB_LNG, lat, lng);
    if (distance > APPROACH_KM) continue;

    const name = item?.train_name ?? item?.name ?? item?.trainName ?? 'Unknown';
    const number = item?.train_no ?? item?.number ?? item?.trainNumber ?? '';
    const dir = item?.direction ?? item?.dir ?? '';

    trains.push({
      trainName: name,
      trainNumber: String(number),
      direction: dir.toLowerCase() === 'down' ? 'down' : 'up',
      distanceKm: Math.round(distance * 100) / 100,
      lastUpdated: new Date(),
    });
  }

  return trains.sort((a, b) => a.distanceKm - b.distanceKm);
}

export async function fetchApproachingTrains(): Promise<ApproachingTrain[]> {
  if (lastFetch && Date.now() - lastFetch.getTime() < CACHE_TTL) {
    return cache;
  }

  cache = [];
  lastFetch = new Date();

  if (!apiKey()) return cache;

  try {
    const url = `${apiUrl()}/stations/VNB/trains`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.warn(`RailRadar API error: ${res.status}`);
      return cache;
    }

    const data = await res.json();
    cache = parseTrains(data);
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      console.error('RailRadar fetch failed:', err?.message ?? err);
    }
  }

  return cache;
}

export function getVnbPosition() {
  return { lat: VNB_LAT, lng: VNB_LNG, approachKm: APPROACH_KM };
}
