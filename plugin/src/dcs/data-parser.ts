/**
 * Parser for DCS-ExportScripts Ikarus data format.
 *
 * DCS-ExportScripts sends cockpit data as colon-separated key=value pairs:
 *   "4=0.5486:12=1.0000:2000=251.000"
 *
 * Keys are numeric argument IDs, values are strings (usually numeric).
 */

/** Parsed export data: maps argument ID to string value */
export type ExportData = Map<number, string>;

/**
 * Parse a raw DCS-ExportScripts data packet.
 *
 * @param raw - The raw UDP message string
 * @returns Map of argument ID to value string
 */
export function parseExportData(raw: string): ExportData {
  const result: ExportData = new Map();
  const trimmed = raw.trim();
  if (!trimmed) return result;

  const pairs = trimmed.split(":");
  for (const pair of pairs) {
    const eqIdx = pair.indexOf("=");
    if (eqIdx <= 0) continue;

    const idStr = pair.substring(0, eqIdx);
    const value = pair.substring(eqIdx + 1);
    const id = parseInt(idStr, 10);

    if (!isNaN(id)) {
      result.set(id, value);
    }
  }

  return result;
}
