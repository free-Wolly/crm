import { styled } from '@mui/material/styles';
import { Paper, Button, TableCell, TableRow } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '10px',
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a73e8',
  color: 'white',
  '&:hover': {
    backgroundColor: '#1765cc',
  },
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 'bold',
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none',
  padding: '16px 0',
  '&:first-of-type': {
    paddingLeft: '16px',
  },
  '&:last-of-type': {
    paddingRight: '16px',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));