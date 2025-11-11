import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import { Star } from "lucide-react";
import { TableSortLabel } from "@mui/material";
import Box from "@mui/material/Box";

export const TableHeaderRow = ({
  columns = [],
  selectable = false,
  starable = false,
  onSelectAll,
  onSort,
  onStarSort,
  selectedCount = 0,
  rowCount = 0,
}) => {
  return (
    <TableRow sx={{ backgroundColor: "#F3F4F6" }}>
      {selectable && (
        <TableCell padding="checkbox" sx={{ backgroundColor: "#F3F4F6" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              color="primary"
              indeterminate={selectedCount > 0 && selectedCount < rowCount}
              checked={rowCount > 0 && selectedCount === rowCount}
              onChange={onSelectAll}
              inputProps={{ "aria-label": "select all" }}
            />
            {starable && (
              <Box
                component="button"
                onClick={() => onStarSort && onStarSort()}
                sx={{
                  ml: 1,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  "&:focus": { outline: "none" }
                }}
                aria-label="Sort by liked status"
              >
                <Star size={20} className="text-gray-500" />
              </Box>
            )}
          </Box>
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell
          key={column.id}
          align={column.numeric ? "right" : "left"}
          padding={column.disablePadding ? "none" : "normal"}
          sortDirection={column.sortable ? column.sortDirection : false}
          sx={{
            minWidth: column.minWidth,
            backgroundColor: "#F3F4F6"
          }}
        >
          {column.sortable ? (
            <TableSortLabel
              active={column.sortDirection !== false}
              direction={column.sortDirection || "asc"}
              onClick={() => onSort && onSort(column.id)}
            >
              {column.label}
            </TableSortLabel>
          ) : (
            column.label
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};