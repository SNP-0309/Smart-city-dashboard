'use client';

export function downloadText(filename: string, text: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown) {
  const s = String(value ?? '');
  if (/[,"\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export function toCSV<T extends Record<string, any>>(rows: T[], headers?: { key: keyof T; label: string }[]) {
  if (!rows.length) return '';
  const cols =
    headers ??
    (Object.keys(rows[0]).map((k) => ({ key: k as keyof T, label: k })) as { key: keyof T; label: string }[]);
  const head = cols.map((c) => csvEscape(c.label)).join(',');
  const body = rows
    .map((r) => cols.map((c) => csvEscape(r[c.key])).join(','))
    .join('\n');
  return `${head}\n${body}\n`;
}

