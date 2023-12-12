import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataRow } from '../DataRow';
import styles from './BasicTable.module.css';

// Interface for the component props
interface BasicTableProps {
  data: DataRow[];
}

const BasicTable: React.FC<BasicTableProps> = ({ data }) => {
  // Assuming the first row of data can be used to infer headers
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} className={styles.headerCell} sx={{fontWeight: 'bold'}}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
            key={rowIndex}
            className={rowIndex % 2 === 0 ? '' : styles.rowOdd}
          >
            {headers.map((header) => (
              <TableCell key={header}>{row[header]}</TableCell>
            ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
