import { Page, expect } from '@playwright/test';
import { API } from '@data/testData';

/**
 * Live-inventory helpers.
 *
 * Pre-production inventory is mutable: a unit that is available today may be booked
 * tomorrow. Journeys therefore resolve a *currently* available unit through these
 * helpers and then drive the UI against that unit, rather than hard-coding one and
 * going stale. Requests run inside the page so they inherit the authenticated session.
 */

export interface AvailableUnit {
  id: string;
  unitName: string;
  unitType: string;
  unitModelId: string;
  price: number;
  targetSegments: string[];
  bookingStatus: string;
}

export interface ProjectInfo {
  id: string;
  code: string;
  nameEn: string;
  projectType: string;
  phase: string;
  status: string;
  /** Project-level gate. When false the CTA is shown but start_booking returns 403. */
  bookable: boolean;
  availableUnitsCount: number;
}

async function fetchJson<T>(page: Page, url: string): Promise<T> {
  return page.evaluate(async (u) => {
    const res = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } });
    return res.json();
  }, url);
}

/** Read project-level metadata, including the `bookable` gate. */
export async function getProject(page: Page, projectId: number): Promise<ProjectInfo> {
  const body = await fetchJson<any>(page, API.project(projectId));
  const a = body?.data?.attributes ?? {};
  return {
    id: String(a.id ?? projectId),
    code: a.code,
    nameEn: a.media_name_en ?? a.name,
    projectType: a.project_type,
    phase: a.phase,
    status: a.status,
    bookable: Boolean(a.bookable),
    availableUnitsCount: a.units_statistic_data?.available_units_count ?? 0,
  };
}

/** All units the marketplace currently reports as available for a project. */
export async function getAvailableUnits(page: Page, projectId: number): Promise<AvailableUnit[]> {
  const body = await fetchJson<any>(page, API.availableUnits(projectId));
  return (body?.data ?? []).map((u: any) => ({
    id: String(u.id),
    unitName: u.attributes?.unit_name,
    unitType: u.attributes?.unit_type,
    unitModelId: String(u.attributes?.unit_model_id),
    price: u.attributes?.price,
    targetSegments: Array.isArray(u.attributes?.target_segments)
      ? u.attributes.target_segments
      : [u.attributes?.target_segments].filter(Boolean),
    bookingStatus: u.attributes?.booking_status,
  }));
}

/**
 * First unit a non-beneficiary account is actually allowed to book.
 * Business rule: units carry `target_segments`; a non-beneficiary may only book
 * inventory whose segments include `non_bene`.
 */
export async function findBookableNonBeneUnit(page: Page, projectId: number): Promise<AvailableUnit> {
  const units = await getAvailableUnits(page, projectId);
  const unit = units.find(
    (u) => u.bookingStatus === 'available' && u.targetSegments.includes('non_bene'),
  );
  expect(
    unit,
    `Expected project ${projectId} to expose at least one available non-beneficiary unit`,
  ).toBeTruthy();
  return unit!;
}

/**
 * Same rule as `findBookableNonBeneUnit`, but returns `null` instead of failing
 * when nothing is available.
 *
 * Use this when a missing unit is a **test-data blocker** to be reported via
 * `test.skip` with a reason, rather than a product failure. The asserting
 * variant stays for journeys where absent inventory genuinely fails the test.
 */
export async function findBookableUnit(
  page: Page,
  projectId: number,
): Promise<AvailableUnit | null> {
  const units = await getAvailableUnits(page, projectId).catch(() => [] as AvailableUnit[]);
  return (
    units.find((u) => u.bookingStatus === 'available' && u.targetSegments.includes('non_bene')) ??
    null
  );
}

/** The authenticated beneficiary profile — the source of truth for eligibility rules. */
export async function getBeneficiary(page: Page): Promise<any> {
  const body = await fetchJson<any>(
    page,
    `${API.me}?include=beneficiary_assets_detail,beneficiary_application,active_booking`,
  );
  return body?.data?.attributes ?? {};
}

/** Project codes in which the account already holds an active booking. */
export async function getActiveBookingProjectCodes(page: Page): Promise<string[]> {
  const me = await getBeneficiary(page);
  return Object.keys(me.number_of_active_bookings_by_project ?? {});
}
