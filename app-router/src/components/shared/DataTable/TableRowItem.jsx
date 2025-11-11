import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import { Star } from "lucide-react";
import Box from "@mui/material/Box";

export const TableRowItem = ({
  row,
  columns = [],
  selectable = false,
  starable = false,
  isSelected = false,
  onSelect,
  onStar,
  onRowClick,
  isLast = false,
}) => {
  const handleSelect = (event) => {
    if (onSelect) onSelect(event, row.id);
  };

  const handleStar = (event) => {
    event.stopPropagation();
    if (onStar) onStar(row.id);
  };
  
  const handleRowClick = () => {
    if (onRowClick) onRowClick(row);
  };

  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={-1}
      selected={isSelected}
      onClick={handleRowClick}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        cursor: onRowClick ? "pointer" : "default",
      }}
    >
      {selectable && (
        <TableCell padding="checkbox">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              color="primary"
              checked={isSelected}
              onChange={handleSelect}
              onClick={(e) => e.stopPropagation()} // Prevent row click when checkbox clicked
            />
            {starable && (
              <Box
                component="button"
                onClick={handleStar}
                sx={{
                  ml: 1,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  "&:focus": { outline: "none" },
                }}
                aria-label={row.starred ? "Unstar item" : "Star item"}
              >
                {row.starred ? (
                  <Star size={20} fill="#f59e0b" className="text-yellow-500" />
                ) : (
                  <Star size={20} className="text-gray-500" />
                )}
              </Box>
            )}
          </Box>
        </TableCell>
      )}
      {columns.map((column) => {
        const value = row[column.id];
        return (
          <TableCell
            key={column.id}
            align={column.numeric ? "right" : "left"}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: column.maxWidth || "none",
            }}
          >
            {column.render ? column.render(value, row) : value}
          </TableCell>
        );
      })}
    </TableRow>
  );
};