import { useState } from 'react';

export const useTablePagination = (initialRowsPerPage = 5) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage };
};

export const sliceData = <T>(data: T[], page: number, rowsPerPage: number) => {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
};