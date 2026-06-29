import React, { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormColumn } from '../types';

interface DynamicSpreadsheetProps {
  columns: FormColumn[];
  data: any[];
  onChange: (newData: any[]) => void;
  readOnly?: boolean;
}

// ─── Helper: Build multi-level header rows from columns ───
interface HeaderCell {
  label: string;
  colSpan: number;
  rowSpan: number;
  colId?: string; // set for leaf-level cells
}

function buildHeaderRows(columns: FormColumn[]): HeaderCell[][] {
  const hasGroup = columns.some(c => c.group);
  const hasSubGroup = columns.some(c => c.subGroup);
  const hasSubSubGroup = columns.some(c => (c as any).subSubGroup);

  if (!hasGroup) {
    // Simple single-row header
    return [columns.map(c => ({ label: c.label, colSpan: 1, rowSpan: 1, colId: c.id }))];
  }

  // Determine total header levels
  const levels = hasSubSubGroup ? 4 : (hasSubGroup ? 3 : 2);

  // Rows for different header levels
  const rows: HeaderCell[][] = Array.from({ length: levels }, () => []);

  let i = 0;
  while (i < columns.length) {
    const col = columns[i];

    if (!col.group) {
      // Ungrouped column spans all header rows
      rows[0].push({ label: col.label, colSpan: 1, rowSpan: levels, colId: col.id });
      i++;
      continue;
    }

    // Find all columns in the same group
    const groupName = col.group;
    let groupStart = i;
    let groupCount = 0;
    while (i < columns.length && columns[i].group === groupName) {
      groupCount++;
      i++;
    }

    // Add the top-level group to Row 0
    rows[0].push({ label: groupName, colSpan: groupCount, rowSpan: 1 });

    if (levels === 2) {
      // 2 levels: Row 0 (group), Row 1 (leaf)
      for (let j = groupStart; j < groupStart + groupCount; j++) {
        rows[1].push({ label: columns[j].label, colSpan: 1, rowSpan: 1, colId: columns[j].id });
      }
    } else if (levels === 3) {
      // 3 levels: Row 0 (group), Row 1 (subGroup), Row 2 (leaf)
      let k = groupStart;
      while (k < groupStart + groupCount) {
        const subCol = columns[k];
        if (!subCol.subGroup) {
          // No sub-group, spans row1 and rowLeaf
          rows[1].push({ label: subCol.label, colSpan: 1, rowSpan: 2, colId: subCol.id });
          k++;
          continue;
        }
        const subName = subCol.subGroup;
        let subStart = k;
        let subCount = 0;
        while (k < groupStart + groupCount && columns[k].subGroup === subName) {
          subCount++;
          k++;
        }
        rows[1].push({ label: subName, colSpan: subCount, rowSpan: 1 });
        for (let m = subStart; m < subStart + subCount; m++) {
          rows[2].push({ label: columns[m].label, colSpan: 1, rowSpan: 1, colId: columns[m].id });
        }
      }
    } else if (levels === 4) {
      // 4 levels: Row 0 (group), Row 1 (subGroup), Row 2 (subSubGroup), Row 3 (leaf)
      let k = groupStart;
      while (k < groupStart + groupCount) {
        const subCol = columns[k];
        if (!subCol.subGroup) {
          // No subGroup: spans Row 1, Row 2, Row 3
          rows[1].push({ label: subCol.label, colSpan: 1, rowSpan: 3, colId: subCol.id });
          k++;
          continue;
        }

        const subName = subCol.subGroup;
        let subStart = k;
        let subCount = 0;
        while (k < groupStart + groupCount && columns[k].subGroup === subName) {
          subCount++;
          k++;
        }

        // Add subGroup to Row 1
        rows[1].push({ label: subName, colSpan: subCount, rowSpan: 1 });

        // Process subSubGroups inside this subGroup
        let p = subStart;
        while (p < subStart + subCount) {
          const subSubCol = columns[p] as any;
          if (!subSubCol.subSubGroup) {
            // No subSubGroup: spans Row 2 and Row 3
            rows[2].push({ label: subSubCol.label, colSpan: 1, rowSpan: 2, colId: subSubCol.id });
            p++;
            continue;
          }

          const subSubName = subSubCol.subSubGroup;
          let subSubStart = p;
          let subSubCount = 0;
          while (p < subStart + subCount && (columns[p] as any).subSubGroup === subSubName) {
            subSubCount++;
            p++;
          }

          // Add subSubGroup to Row 2
          rows[2].push({ label: subSubName, colSpan: subSubCount, rowSpan: 1 });

          // Add leaf labels to Row 3
          for (let m = subSubStart; m < subSubStart + subSubCount; m++) {
            rows[3].push({ label: columns[m].label, colSpan: 1, rowSpan: 1, colId: columns[m].id });
          }
        }
      }
    }
  }

  return rows.filter(r => r.length > 0);
}

export default function DynamicSpreadsheet({
  columns,
  data = [],
  onChange,
  readOnly = false,
}: DynamicSpreadsheetProps) {

  const headerRows = useMemo(() => buildHeaderRows(columns), [columns]);

  // Handle cell edit change
  const handleCellChange = (rowIndex: number, columnId: string, value: any) => {
    const updatedData = [...data];
    const col = columns.find(c => c.id === columnId);
    let castedValue = value;

    if (col?.type === 'number') {
      if (value === '') {
        castedValue = null;
      } else {
        const num = Number(value);
        castedValue = isNaN(num) ? value : num;
      }
    } else if (col?.type === 'boolean') {
      castedValue = value === 'true' || value === true || value === 'Đạt';
    }

    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [columnId]: castedValue,
    };

    // Auto-calculate row totals for Biểu 09 and Biểu 12
    const row = updatedData[rowIndex];
    if (row && !row.isHeader) {
      // 1. Calculate Vốn đầu tư trực tiếp (Tổng số vốn ĐTTT) = NSTW ĐTPT + NSTW SN + NSĐP
      const hd_vdt_total = (Number(row.hd_nstw_dtpt) || 0) + (Number(row.hd_nstw_sn) || 0) + (Number(row.hd_nsdp) || 0);
      const kh_vdt_total = (Number(row.kh_nstw_dtpt) || 0) + (Number(row.kh_nstw_sn) || 0) + (Number(row.kh_nsdp) || 0);
      
      row.hd_vdt_total = hd_vdt_total;
      row.kh_vdt_total = kh_vdt_total;

      // 2. Calculate Tổng số = Vốn đầu tư trực tiếp + Vốn lồng ghép + Vốn tín dụng + Vốn doanh nghiệp + Dân đóng góp
      row.hd_total = hd_vdt_total + (Number(row.hd_longGhep) || 0) + (Number(row.hd_tinDung) || 0) + (Number(row.hd_doanhNghiep) || 0) + (Number(row.hd_danGop) || 0);
      row.kh_total = kh_vdt_total + (Number(row.kh_longGhep) || 0) + (Number(row.kh_tinDung) || 0) + (Number(row.kh_doanhNghiep) || 0) + (Number(row.kh_danGop) || 0);
    }

    onChange(updatedData);
  };

  // Add a new row to the spreadsheet
  const handleAddRow = () => {
    const nextId = data.length > 0 ? Math.max(...data.map(r => Number(r.id) || 0)) + 1 : 1;
    const nextStt = data.length > 0 ? String(data.filter(r => !r.isHeader).length + 1) : '1';

    const newRow: any = { id: nextId };

    columns.forEach(col => {
      if (col.id === 'tt' || col.id === 'STT' || col.id === 'stt') {
        newRow[col.id] = nextStt;
      } else if (col.type === 'number') {
        newRow[col.id] = 0;
      } else if (col.type === 'boolean') {
        newRow[col.id] = false;
      } else {
        newRow[col.id] = '';
      }
    });

    onChange([...data, newRow]);
  };

  // Add a child row (detailed sub-component) under a selected parent row
  const handleAddChildRow = (parentRowId: any) => {
    const parentIdx = data.findIndex(r => r.id === parentRowId);
    if (parentIdx === -1) return;

    // Find insertion index (after the parent and its existing child rows)
    let insertIdx = parentIdx;
    while (insertIdx + 1 < data.length && data[insertIdx + 1].parentId === parentRowId) {
      insertIdx++;
    }

    const nextId = data.length > 0 ? Math.max(...data.map(r => Number(r.id) || 0)) + 1 : 1;
    const parentRow = data[parentIdx];
    const childrenCount = data.filter(r => r.parentId === parentRowId).length;
    const parentTT = parentRow.tt || parentRow.STT || parentRow.stt || '1';
    const nextStt = `${parentTT}.${childrenCount + 1}`;

    const newRow: any = { 
      id: nextId, 
      parentId: parentRowId,
    };

    columns.forEach(col => {
      if (col.id === 'tt' || col.id === 'STT' || col.id === 'stt') {
        newRow[col.id] = nextStt;
      } else if (col.id === 'category') {
        newRow[col.id] = `Nội dung chi tiết ${childrenCount + 1}`;
      } else if (col.type === 'number') {
        newRow[col.id] = 0;
      } else if (col.type === 'boolean') {
        newRow[col.id] = false;
      } else {
        newRow[col.id] = '';
      }
    });

    const updatedData = [...data];
    updatedData.splice(insertIdx + 1, 0, newRow);
    onChange(updatedData);
  };

  // Delete a row
  const handleDeleteRow = (rowIndex: number) => {
    const updatedData = data.filter((_, idx) => idx !== rowIndex);
    onChange(updatedData);
  };

  // Calculate sum for numeric columns
  const getColumnSum = (columnId: string) => {
    if (['tt', 'id', 'year', 'startDate', 'endDate', 'category', 'unit', 'type', 'codeAndDate', 'summary', 'mainGoal', 'mainContent', 'note', 'stt', 'STT'].includes(columnId)) {
      return '';
    }
    const col = columns.find(c => c.id === columnId);
    if (!col || col.type !== 'number') return '';

    const sum = data.reduce((acc, row) => {
      if (row.isHeader) return acc;
      const val = Number(row[columnId]);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    return sum;
  };

  const hasNumericColumns = columns.some(col =>
    col.type === 'number' &&
    !['tt', 'id', 'year', 'startDate', 'endDate'].includes(col.id)
  );

  // Color palette for groups
  const groupColors: Record<string, { bg: string; text: string; border: string }> = {};
  const palette = [
    { bg: 'bg-blue-50/40', text: 'text-blue-900', border: 'border-blue-200' },
    { bg: 'bg-amber-50/40', text: 'text-amber-900', border: 'border-amber-200' },
    { bg: 'bg-emerald-50/40', text: 'text-emerald-900', border: 'border-emerald-200' },
    { bg: 'bg-indigo-50/40', text: 'text-indigo-900', border: 'border-indigo-200' },
    { bg: 'bg-rose-50/40', text: 'text-rose-900', border: 'border-rose-200' },
  ];
  let colorIdx = 0;
  columns.forEach(c => {
    if (c.group && !groupColors[c.group]) {
      groupColors[c.group] = palette[colorIdx % palette.length];
      colorIdx++;
    }
  });

  const getGroupColor = (colId: string) => {
    const col = columns.find(c => c.id === colId);
    if (col?.group && groupColors[col.group]) return groupColors[col.group];
    return null;
  };

  const minTableWidth = useMemo(() => {
    const totalWidth = columns.reduce((sum, col) => sum + (col.width || 120), 0);
    return totalWidth + (readOnly ? 0 : 80);
  }, [columns, readOnly]);

  const totalDataCols = columns.length;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-150 shadow-sm bg-white">
        <table 
          className="w-full text-xs text-left border-collapse"
          style={{ minWidth: `${minTableWidth}px`, tableLayout: 'fixed' }}
        >
          <colgroup>
            {columns.map(col => (
              <col key={col.id} style={{ width: `${col.width || 120}px` }} />
            ))}
            {!readOnly && <col style={{ width: '80px' }} />}
          </colgroup>
          <thead>
            {headerRows.map((row, rowIdx) => (
              <tr
                key={`hdr-${rowIdx}`}
                className="bg-slate-50 text-slate-600 uppercase text-[11px] font-black tracking-wider border-b border-slate-100"
              >
                {row.map((cell, cellIdx) => {
                  const gc = cell.colId ? getGroupColor(cell.colId) : null;
                  // For group-level cells, find color by matching group name
                  let headerBg = '';
                  let headerText = '';
                  if (!cell.colId && cell.colSpan > 1) {
                    // This is a group header
                    const matchedGroup = Object.keys(groupColors).find(g => g === cell.label);
                    if (matchedGroup) {
                      headerBg = groupColors[matchedGroup].bg;
                      headerText = groupColors[matchedGroup].text;
                    }
                    // Check subGroups too
                    if (!matchedGroup) {
                      // Check if any column has this as subGroup
                      const matchCol = columns.find(c => c.subGroup === cell.label);
                      if (matchCol?.group && groupColors[matchCol.group]) {
                        headerBg = groupColors[matchCol.group].bg;
                        headerText = groupColors[matchCol.group].text;
                      }
                    }
                  }
                  if (gc && cell.colId) {
                    headerBg = gc.bg;
                    headerText = gc.text;
                  }

                  return (
                    <th
                      key={`hdr-${rowIdx}-${cellIdx}`}
                      colSpan={cell.colSpan}
                      rowSpan={cell.rowSpan}
                      className={`py-3 px-3 font-bold border-r border-slate-100 last:border-r-0 text-center ${headerBg} ${headerText}`}
                    >
                      {cell.label}
                    </th>
                  );
                })}
                {/* "Thao tác" column only on the first header row */}
                {!readOnly && rowIdx === 0 && (
                  <th
                    className="py-3 px-3 text-center w-20 border-r-0 font-bold"
                    rowSpan={headerRows.length}
                  >
                    Thao tác
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={totalDataCols + (readOnly ? 0 : 1)}
                  className="py-10 text-center text-slate-400 font-medium"
                >
                  Chưa có dữ liệu. Vui lòng thêm dòng mới để nhập số liệu.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                // Header rows (section headers)
                if (row.isHeader) {
                  return (
                    <tr key={row.id || rowIndex} className="bg-slate-100/80 font-black text-slate-800 border-y border-slate-200">
                      <td className="p-3 border-r border-slate-200 font-black text-center text-xs text-[#014285]">
                        {row.sectionCode || row.tt || ''}
                      </td>
                      <td
                        colSpan={totalDataCols - 1 + (readOnly ? 0 : 1)}
                        className="p-3 px-4 text-left font-black uppercase text-xs text-[#0f2942] tracking-wide"
                      >
                        {row.category || ''}
                      </td>
                    </tr>
                  );
                }

                // Regular data rows
                const hasParent = !!row.parentId;

                return (
                  <tr key={row.id || rowIndex} className="hover:bg-slate-50/50 transition-colors">
                    {columns.map((col) => {
                      let val = row[col.id] !== undefined ? row[col.id] : '';
                      // Fallback to row.category if this is the first non-tt text column and it is currently empty/undefined
                      if (col.id !== 'tt' && col.type === 'text' && !val) {
                        const firstTextCol = columns.find(c => c.id !== 'tt' && c.type === 'text');
                        if (firstTextCol && firstTextCol.id === col.id && row.category) {
                          val = row.category;
                        }
                      }
                      const gc = getGroupColor(col.id);
                      const cellBg = gc ? gc.bg.replace('/40', '/10') : '';

                      // Category column with indentation for child rows
                      const isCategory = col.id === 'category';
                      const isTT = col.id === 'tt' || col.id === 'STT' || col.id === 'stt';

                      return (
                        <td key={col.id} className={`p-1 border-r border-slate-100 last:border-r-0 ${cellBg}`}>
                          {readOnly ? (
                            <div className={`px-3 py-2.5 font-semibold text-slate-800 break-words ${isCategory && hasParent ? 'pl-8' : ''}`}>
                              {col.type === 'boolean'
                                ? (val === true || val === 'Đạt' || val === 'true' ? 'Đạt' : 'Không đạt')
                                : (typeof val === 'number' ? val.toLocaleString('vi-VN') : val)}
                            </div>
                          ) : (
                            <div>
                              {col.type === 'boolean' ? (
                                <select
                                  value={val === true || val === 'true' || val === 'Đạt' ? 'Đạt' : 'Không đạt'}
                                  onChange={(e) => handleCellChange(rowIndex, col.id, e.target.value === 'Đạt')}
                                  className="w-full text-xs px-2.5 py-1.5 border border-transparent rounded-lg outline-none focus:ring-2 focus:ring-[#014285]/20 focus:border-[#014285] hover:border-slate-200 transition-all font-semibold text-slate-800 bg-transparent focus:bg-white"
                                >
                                  <option value="Đạt">Đạt</option>
                                  <option value="Không đạt">Không đạt</option>
                                </select>
                              ) : col.type === 'number' ? (
                                <input
                                  type="number"
                                  value={val === null || val === undefined ? '' : val}
                                  onChange={(e) => handleCellChange(rowIndex, col.id, e.target.value)}
                                  className="w-full text-xs px-2.5 py-1.5 border border-transparent rounded-lg outline-none focus:ring-2 focus:ring-[#014285]/20 focus:border-[#014285] hover:border-slate-200 transition-all font-semibold text-slate-800 bg-transparent focus:bg-white text-center disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:text-[#014285] disabled:font-black"
                                  disabled={['hd_total', 'kh_total', 'hd_vdt_total', 'kh_vdt_total'].includes(col.id)}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => handleCellChange(rowIndex, col.id, e.target.value)}
                                  className={`w-full text-xs px-2.5 py-1.5 border border-transparent rounded-lg outline-none focus:ring-2 focus:ring-[#014285]/20 focus:border-[#014285] hover:border-slate-200 transition-all font-semibold text-slate-800 bg-transparent focus:bg-white ${isCategory && hasParent ? 'pl-8' : ''}`}
                                  disabled={isTT}
                                />
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    {!readOnly && (
                      <td className="p-1 text-center border-r-0">
                        <div className="flex items-center justify-center gap-1">
                          {!row.isHeader && !row.parentId && (
                            <button
                              onClick={() => handleAddChildRow(row.id)}
                              className="p-1.5 text-blue-500 hover:text-[#014285] hover:bg-blue-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                              title="Thêm thành phần chi tiết"
                            >
                              <Plus className="w-4 h-full shrink-0" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRow(rowIndex)}
                            className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                            title="Xóa dòng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}

            {/* Subtotal Row */}
            {data.length > 0 && hasNumericColumns && (
              <tr className="bg-slate-50 font-black text-[#014285] border-t border-slate-200">
                {columns.map((col, idx) => {
                  const isFirst = idx === 0;
                  const sumValue = getColumnSum(col.id);

                  return (
                    <td key={col.id} className="py-3 px-4 border-r border-slate-200 last:border-r-0 font-bold text-center">
                      {isFirst ? (
                        <span>Tổng cộng</span>
                      ) : sumValue !== '' ? (
                        <span>{typeof sumValue === 'number' ? sumValue.toLocaleString('vi-VN') : sumValue}</span>
                      ) : null}
                    </td>
                  );
                })}
                {!readOnly && <td className="py-3 px-4 border-r-0"></td>}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="flex justify-end">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-[#014285] hover:bg-blue-50 text-[#014285] rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm dòng dữ liệu
          </button>
        </div>
      )}
    </div>
  );
}
