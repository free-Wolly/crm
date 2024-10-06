import React, { useState, useEffect, useCallback } from 'react';
import { 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { User } from '../interfaces';
import { StyledPaper, StyledButton, StyledTableCell, StyledTableRow } from '../styles/styledComponents';
import { fetchUsers, register } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PermissionGate from '../components/PermissionGate';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ email: '', password: '', role: 'USER' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 403) {
        logout();
      } else {
        setError('Failed to fetch users. Please try again.');
      }
    }
  }, [logout]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewUser({ email: '', password: '', role: 'USER' });
    setOpen(false);
  };

  const handleAddUser = async () => {
    try {
      const response = await register(newUser);
      setUsers(prevUsers => [...prevUsers, response]);
      handleClose();
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. Please try again.');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Users</Typography>
        <PermissionGate allowedRoles={['ADMIN']}>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            New User
          </StyledButton>
        </PermissionGate>
      </Box>
      <StyledPaper>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search user..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell padding="checkbox">
                    <Checkbox color="primary" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center">
                      Email <ArrowUpwardIcon fontSize="small" />
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell align="right"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell padding="checkbox">
                      <Checkbox color="primary" />
                    </StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>{user.role}</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </StyledPaper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={newUser.role}
              label="Role"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'ADMIN' | 'USER' })}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="USER">USER</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleClose}>Cancel</StyledButton>
          <StyledButton onClick={handleAddUser}>Add</StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;