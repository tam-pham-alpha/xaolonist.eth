import { FIX_TAGS, MSG_TYPES, SIDE_LABEL } from './fix-tags';

export type FixField = { tag: number; name: string; value: string };

export type FixMessage = {
  id: number;
  raw: string;
  fields: FixField[];
  time: string;
  sender: string;
  msgType: string;
  msgTypeLabel: string;
  clOrdId: string;
  side: string;
  sideLabel: string;
  symbol: string;
};

function normalizeDelimiter(text: string): string {
  // Prefer real SOH; also accept | and ^A
  if (text.includes('\x01')) return text;
  return text.replace(/\^A/g, '\x01').replace(/\|/g, '\x01');
}

function splitMessages(normalized: string): string[] {
  // Messages typically start with 8=FIX
  const parts = normalized
    .split(/(?=8=FIX)/g)
    .map((s) => s.replace(/[\r\n]+/g, '').trim())
    .filter((s) => s.startsWith('8=FIX'));
  if (parts.length > 0) return parts;

  // Fallback: one blob per non-empty line
  return normalized
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && /\d+=/.test(l));
}

export function parseFields(raw: string): FixField[] {
  const normalized = normalizeDelimiter(raw).replace(/[\r\n]+/g, '');
  const chunks = normalized.split('\x01').filter(Boolean);
  const fields: FixField[] = [];
  for (const chunk of chunks) {
    const eq = chunk.indexOf('=');
    if (eq <= 0) continue;
    const tag = Number(chunk.slice(0, eq));
    if (!Number.isFinite(tag)) continue;
    const value = chunk.slice(eq + 1);
    fields.push({
      tag,
      name: FIX_TAGS[tag] ?? `Tag ${tag}`,
      value,
    });
  }
  return fields;
}

function fieldMap(fields: FixField[]): Map<number, string> {
  const m = new Map<number, string>();
  for (const f of fields) m.set(f.tag, f.value);
  return m;
}

export function parseFixLog(text: string): FixMessage[] {
  if (!text.trim()) return [];
  const normalized = normalizeDelimiter(text);
  const blobs = splitMessages(normalized);
  return blobs.map((raw, id) => {
    const fields = parseFields(raw);
    const map = fieldMap(fields);
    const msgType = map.get(35) ?? '';
    const side = map.get(54) ?? '';
    return {
      id,
      raw,
      fields,
      time: map.get(52) ?? map.get(60) ?? '',
      sender: map.get(49) ?? '',
      msgType,
      msgTypeLabel: MSG_TYPES[msgType] ?? (msgType || '—'),
      clOrdId: map.get(11) ?? '',
      side,
      sideLabel: SIDE_LABEL[side] ?? (side || '—'),
      symbol: map.get(55) ?? '',
    };
  });
}

export function messageMatchesQuery(msg: FixMessage, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  if (
    msg.time.toLowerCase().includes(needle) ||
    msg.sender.toLowerCase().includes(needle) ||
    msg.msgTypeLabel.toLowerCase().includes(needle) ||
    msg.msgType.toLowerCase().includes(needle) ||
    msg.clOrdId.toLowerCase().includes(needle) ||
    msg.sideLabel.toLowerCase().includes(needle) ||
    msg.symbol.toLowerCase().includes(needle) ||
    msg.raw.toLowerCase().includes(needle)
  ) {
    return true;
  }
  return msg.fields.some(
    (f) =>
      String(f.tag).includes(needle) ||
      f.name.toLowerCase().includes(needle) ||
      f.value.toLowerCase().includes(needle),
  );
}
