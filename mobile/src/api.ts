import { API_BASE_URL, governmentLocations, roads, type GovernmentLocation, type Road } from './data';

const CITIZEN_TOKEN = 'demo-citizen-token';

export type CitizenIssue = {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  priority: string;
  priority_score: number;
  grouped_reports: number;
  assigned_to?: { worker_name: string; department: string; eta: string } | null;
  evidence: Array<{ id: string; evidence_type: string; note: string; uploaded_at: string }>;
  citizen_confirmation?: { confirmed: boolean; note: string; confirmed_at: string } | null;
  created_at: string;
  updated_at: string;
};

export type AdminWorker = { id: string; name: string; department: string; availability: string; active_assignments: number };

export type AdminMetrics = { total: number; open: number; awaiting_confirmation: number; grouped_reports: number; audit_events: number; by_status: Record<string, number> };

export async function fetchRoads(): Promise<{ roads: Road[]; connected: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/roads/segments`);
    if (!response.ok) throw new Error('Unable to load roads');
    const payload = await response.json();
    const connectedRoads = (payload.segments ?? roads).map((item: any): Road => ({
      id: item.id,
      name: item.name,
      area: item.area,
      condition: item.condition ?? item.condition_status,
      score: item.score ?? item.priority_score,
      complaints: item.complaints ?? item.open_complaints,
      risk: item.risk ?? item.waterlogging_risk,
      status: item.status ?? item.maintenance_status,
      verified: item.verified ?? item.verification_status === 'Verified',
      lat: item.lat,
      lng: item.lng,
      source: item.source,
      lastVerifiedAt: item.lastVerifiedAt ?? item.last_verified_at,
    }));
    return { roads: connectedRoads, connected: true };
  } catch {
    // The demo remains usable when the FastAPI server is not running.
    return { roads, connected: false };
  }
}

export async function fetchGovernmentLocations(): Promise<{ locations: GovernmentLocation[]; connected: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/government/locations`);
    if (!response.ok) throw new Error('Unable to load government data');
    const payload = await response.json();
    const connectedLocations = (payload.locations ?? governmentLocations).map((item: any): GovernmentLocation => ({
      id: item.id,
      name: item.name,
      district: item.district,
      authority: item.authority,
      adminLevel: item.adminLevel ?? item.admin_level,
      population2011: item.population2011 ?? item.population_2011 ?? null,
      populationScope: item.populationScope ?? item.population_scope,
      districtVillageRoadsKm: item.districtVillageRoadsKm ?? item.district_village_roads_km,
      roadReferenceYear: item.roadReferenceYear ?? item.road_reference_year,
    }));
    return { locations: connectedLocations, connected: true };
  } catch {
    return { locations: governmentLocations, connected: false };
  }
}

export async function submitRoadReport(input: { roadId?: string; issueType: string; description: string; location: string; reporterName: string }) {
  const response = await fetch(`${API_BASE_URL}/roads/${input.roadId ?? roads[0].id}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issue_type: input.issueType, description: input.description, location: input.location, reporter_name: input.reporterName || 'Anonymous' }),
  });
  if (!response.ok) throw new Error('Report could not be submitted');
  return response.json();
}

export async function fetchCitizenIssues(): Promise<{ issues: CitizenIssue[]; connected: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/citizen/issues`, { headers: { 'x-demo-token': CITIZEN_TOKEN } });
    if (!response.ok) throw new Error('Unable to load citizen issues');
    const payload = await response.json();
    return { issues: payload.issues ?? [], connected: true };
  } catch {
    return { issues: [], connected: false };
  }
}

export async function submitCitizenIssue(input: { roadId?: string; category: string; title: string; description: string; location: string; latitude?: number | null; longitude?: number | null; photoUri?: string | null }) {
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-demo-token': CITIZEN_TOKEN },
    body: JSON.stringify({ category: input.category, title: input.title, description: input.description, location: input.location, latitude: input.latitude ?? null, longitude: input.longitude ?? null, road_id: input.roadId ?? null, reporter_name: 'Nalasopara Citizen', photo_url: input.photoUri ?? null }),
  });
  if (!response.ok) throw new Error('Issue could not be submitted');
  return response.json();
}

export async function confirmCitizenIssue(issueId: string, confirmed: boolean, note: string) {
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-demo-token': CITIZEN_TOKEN },
    body: JSON.stringify({ confirmed, note }),
  });
  if (!response.ok) throw new Error('Confirmation could not be saved');
  return response.json();
}

const ADMIN_TOKEN = 'demo-admin-token';
const adminHeaders = { 'Content-Type': 'application/json', 'x-demo-token': ADMIN_TOKEN };

export async function fetchAdminIssues(): Promise<{ issues: CitizenIssue[]; connected: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/issues`, { headers: adminHeaders });
    if (!response.ok) throw new Error('Unable to load admin issues');
    const payload = await response.json();
    return { issues: payload.issues ?? [], connected: true };
  } catch {
    return { issues: [], connected: false };
  }
}

export async function fetchAdminMetrics(): Promise<AdminMetrics | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/metrics`, { headers: adminHeaders });
    if (!response.ok) throw new Error('Unable to load admin metrics');
    return response.json();
  } catch {
    return null;
  }
}

export async function fetchAdminWorkers(): Promise<AdminWorker[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/workers`, { headers: adminHeaders });
    if (!response.ok) throw new Error('Unable to load workers');
    const payload = await response.json();
    return payload.workers ?? [];
  } catch {
    return [];
  }
}

export async function adminUpdateIssue(issueId: string, status: string, note: string) {
  const response = await fetch(`${API_BASE_URL}/admin/issues/${issueId}/status`, { method: 'PATCH', headers: adminHeaders, body: JSON.stringify({ status, note }) });
  if (!response.ok) throw new Error('Unable to update issue');
  return response.json();
}

export async function adminAssignIssue(issueId: string, worker: AdminWorker) {
  const response = await fetch(`${API_BASE_URL}/admin/issues/${issueId}/assign`, { method: 'POST', headers: adminHeaders, body: JSON.stringify({ worker_id: worker.id, worker_name: worker.name, department: worker.department, eta: '48 hours' }) });
  if (!response.ok) throw new Error('Unable to assign issue');
  return response.json();
}

export async function adminUploadEvidence(issueId: string, note: string) {
  const response = await fetch(`${API_BASE_URL}/admin/issues/${issueId}/evidence`, { method: 'POST', headers: adminHeaders, body: JSON.stringify({ evidence_type: 'after', note }) });
  if (!response.ok) throw new Error('Unable to upload evidence');
  return response.json();
}
