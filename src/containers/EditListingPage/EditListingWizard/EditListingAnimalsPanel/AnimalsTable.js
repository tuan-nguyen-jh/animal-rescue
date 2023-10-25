import React from 'react';
import { FormattedMessage } from 'react-intl';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function AnimalsTable(props) {
  const { rows } = props;

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <FormattedMessage id="AnimalTable.rowId" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="AnimalTable.nameColumnLabel" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="AnimalTable.typeOfAnimalColumnLabel" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="AnimalTable.sizeColumnLabel" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="AnimalTable.birthColumnLabel" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="AnimalTable.imageColumnLabel" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index}</TableCell>
              <TableCell align="center">{row.title}</TableCell>
              <TableCell component="th" scope="row" align="center">
                {row.typeOfAnimal.toUpperCase()}
              </TableCell>
              <TableCell align="center">{row.size.toUpperCase()}</TableCell>
              <TableCell align="center">{row.birth}</TableCell>
              <TableCell align="center">
                {Array.isArray(row.images) ? row.images.length : row.images ? 1 : 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}