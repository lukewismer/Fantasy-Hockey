import React from 'react';
import { DndContext, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
    verticalListSortingStrategy,
  } from "@dnd-kit/sortable";

import TableRow from './TableRow';
import { TableCell, TableContainer, Table, TableHead, TableBody, Paper } from '@material-ui/core';
import { CSS } from '@dnd-kit/utilities';

function SortableRow({ id, index, rowData, columns, classes, constantColumn, ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const isBench = constantColumn.rosterSpot === "Bench";

  
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isBench ? classes.bench : ""}
      {...attributes}
      {...listeners}
      {...props}
    >
      <TableCell>{constantColumn && constantColumn.cell(rowData, constantColumn.rosterSpot)}</TableCell>

      {columns.map((column) => (
        <TableCell key={column.field}>{rowData[column.field]}</TableCell>
      ))}
    </TableRow>
  );
}

const SortableTable = ({ players, handleDragEnd, columns, rosterSpots, classes, constantColumn }) => {

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
      );

      
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      clamping={{ left: 0, right: 0, top: 0, bottom: 0 }}
    >
      <SortableContext
        items={players.map(({ id }) => id)}
        strategy={verticalListSortingStrategy}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{constantColumn && constantColumn.header}</TableCell>
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
                <SortableContext
                    items={players.map(({ id }) => id)}
                    strategy={verticalListSortingStrategy}
                >
                    {players.map((rowData, index) => (
                    <SortableRow
                        key={rowData.id}
                        id={rowData.id}
                        index={index}
                        rowData={rowData}
                        columns={columns}
                        classes={classes}
                        constantColumn={{
                            ...constantColumn,
                            rosterSpot: rosterSpots[index],
                        }}
                    >
                        <TableCell>{constantColumn.cell(rowData, rosterSpots[index])}</TableCell>
                    </SortableRow>
                    ))}
                </SortableContext>
            </TableBody>
          </Table>
        </TableContainer>
      </SortableContext>
    </DndContext>
  );
};

export default SortableTable;
