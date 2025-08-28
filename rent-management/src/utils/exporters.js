import jsPDF from 'jspdf';
import 'jspdf-autotable';

// CSV export utility
export const exportToCsv = (filename, rows) => {
  if (!rows || rows.length === 0) return;
  const allKeys = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  const escape = (val) => {
    const s = val === null || val === undefined ? '' : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}` + '"' : s;
  };
  const header = allKeys.join(',');
  const body = rows.map((r) => allKeys.map((k) => escape(r[k])).join(',')).join('\n');
  const csv = header + '\n' + body;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// PDF export utility using jsPDF and autoTable
export const exportToPdf = ({ title = 'Report', columns = [], rows = [] }) => {
  const doc = new jsPDF('p', 'pt');
  doc.setFontSize(14);
  doc.text(title, 40, 40);
  const tableColumns = columns.map((c) => ({ header: c.label, dataKey: c.key }));
  doc.autoTable({
    startY: 60,
    head: [tableColumns.map((c) => c.header)],
    body: rows.map((r) => tableColumns.map((c) => r[c.dataKey])),
    styles: { fontSize: 9 }
  });
  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};


