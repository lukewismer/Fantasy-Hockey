import React from 'react';
import { TableRow as MuiTableRow, TableCell } from '@material-ui/core';

const TableRow = React.forwardRef(({ id, data, index, children, setNodeRef, ...props }, ref) => {
  return (
    <MuiTableRow ref={ref} {...props}>
      {children}
    </MuiTableRow>
  );
});

export default TableRow;
