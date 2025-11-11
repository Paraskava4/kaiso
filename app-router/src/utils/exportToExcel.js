import * as XLSX from "xlsx-js-style"; // Note: Using the styled version

/**
 * Export an array of row objects to a styled Excel file.
 * @param {Array<Object>} data - Array of row objects
 * @param {Array<Object>} columns - Column definitions
 * @param {string} [fileName="export.xlsx"] - Output filename
 * @param {Object} [options] - Styling options
 */
export const exportToExcel = (
  data = [],
  columns = [],
  fileName = "export.xlsx",
  options = {}
) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("[exportToExcel] No data supplied for export.");
    return;
  }

  // Default styling options
  const {
    headerStyle = {
      fill: { fgColor: { rgb: "267009" } }, // Green background
      font: { bold: true, color: { rgb: "FFFFFF" } }, // White bold text
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      }
    },
    cellStyle = {
      alignment: { horizontal: "left", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "D9D9D9" } },
        bottom: { style: "thin", color: { rgb: "D9D9D9" } },
        left: { style: "thin", color: { rgb: "D9D9D9" } },
        right: { style: "thin", color: { rgb: "D9D9D9" } },
      }
    },
    dateStyle = {
      numFmt: 'dd/mm/yyyy',
      alignment: { horizontal: "center" }
    },
    numberStyle = {
      numFmt: '#,##0.00',
      alignment: { horizontal: "right" }
    }
  } = options;

  // Prepare worksheet data with styling
  const headerRow = columns.map(col => ({
    v: col.label || col.id,
    t: 's',
    s: headerStyle
  }));

  const dataRows = data.map(row => {
    return columns.map(col => {
      let cellValue = row[col.id];
      let style = { ...cellStyle };
      
      // Apply special formatting based on data type
      if (col.type === 'date' && cellValue) {
        style = { ...style, ...dateStyle };
        if (cellValue instanceof Date) {
          cellValue = cellValue;
        } else {
          cellValue = new Date(cellValue);
        }
      } else if (col.type === 'number') {
        style = { ...style, ...numberStyle };
        cellValue = Number(cellValue) || 0;
      }
      
      return {
        v: cellValue,
        t: typeof cellValue === 'number' ? 'n' : 's',
        s: style
      };
    });
  });

  // Create worksheet with headers and data
  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);

  // Set column widths (auto or custom)
  if (options.columnWidths) {
    ws['!cols'] = options.columnWidths.map(width => ({ width }));
  } else {
    // Auto-width calculation
    ws['!cols'] = columns.map(() => ({ width: 20 }));
  }

  // Freeze header row
  ws['!freeze'] = { x: 0, y: 1 };

  // Create workbook and export
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, fileName);
};