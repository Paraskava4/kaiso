import * as React from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import { TableHeaderRow } from "./TableHeaderRow";
import { TableRowItem } from "./TableRowItem";

// Toggle Component
export const StatusToggle = ({ checked = false, onChange, disabled = false }) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
        checked ? 'bg-[#5AB1E0]' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleToggle}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );
};

export const DataTable = ({
  data = [],
  columns = [],
  selectable = false,
  starable = false,
  onSelect,
  onStar,
  onSort,
  onStarSort,
  onRowClick,
  className = "",
  containerProps = {},
  tableProps = {},
}) => {
  const [selected, setSelected] = React.useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((item) => item.id);
      setSelected(newSelected);
      if (onSelect) onSelect(newSelected);
      return;
    }
    setSelected([]);
    if (onSelect) onSelect([]);
  };

  const handleSelect = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
    if (onSelect) onSelect(newSelected);
  };

  const handleStar = (id) => {
    if (onStar) onStar(id);
  };

  return (
    <TableContainer
      component={Paper}
      className={`shadow-sm ${className}`}
      {...containerProps}
    >
      <Table {...tableProps}>
        <TableHead>
          <TableHeaderRow
            columns={columns}
            selectable={selectable}
            starable={starable}
            onSelectAll={handleSelectAll}
            onSort={onSort}
            onStarSort={onStarSort}
            selectedCount={selected.length}
            rowCount={data.length}
          />
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRowItem
              key={row.id || index}
              row={row}
              columns={columns}
              selectable={selectable}
              starable={starable}
              isSelected={selected.includes(row.id)}
              onSelect={handleSelect}
              onStar={handleStar}
              onRowClick={onRowClick}
              isLast={index === data.length - 1}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};