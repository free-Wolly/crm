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
  Button,
  Slider,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Employee, Schedule } from '../interfaces';
import { StyledPaper, StyledButton, StyledTableCell, StyledTableRow } from '../styles/styledComponents';
import { fetchEmployees, addEmployee } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTablePagination, sliceData } from '../helpers/tableHelpers';
import { formatHour } from '../helpers/formHelpers';
import { formatSchedules, createNewSchedule } from '../helpers/employeeHelpers';
import PermissionGate from '../components/PermissionGate';

const workingDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({ 
    name: '', 
    phone: '', 
    salary: 0,
    schedules: []
  });
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const [workingHours, setWorkingHours] = useState<number[]>([9, 17]); // 9 AM to 5 PM by default
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = useTablePagination();

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      if (error.response?.status === 403) {
        logout();
      } else {
        setError('Failed to fetch employees. Please try again.');
      }
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewEmployee({ name: '', phone: '', salary: 0, schedules: [] });
    setOpen(false);
  };

  const handleAddEmployee = async () => {
    try {
      const response = await addEmployee(newEmployee);
      setEmployees(prevEmployees => [...prevEmployees, response]);
      handleClose();
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Failed to add employee. Please try again.');
    }
  };

  const handleWorkingHoursChange = (event: Event, newValue: number | number[]) => {
    setWorkingHours(newValue as number[]);
  };

  const handleAddSchedule = () => {
    setNewEmployee(prev => ({
      ...prev,
      schedules: [...prev.schedules, createNewSchedule(workingHours)]
    }));
  };

  const handleScheduleChange = (index: number, field: keyof Schedule, value: string) => {
    setNewEmployee(prev => ({
      ...prev,
      schedules: prev.schedules.map((schedule, i) => 
        i === index ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Employees</Typography>
        <PermissionGate allowedRoles={['ADMIN']}>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ backgroundColor: '#00BCD4', color: 'white', '&:hover': { backgroundColor: '#00a0b2' } }}
          >
            New Employee
          </StyledButton>
        </PermissionGate>
      </Box>
      <StyledPaper>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search employee..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : employees.length === 0 ? (
            <Typography align="center" my={3}>No employees found.</Typography>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell padding="checkbox">
                        <Checkbox color="primary" />
                      </StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Phone</StyledTableCell>
                      <StyledTableCell>Salary</StyledTableCell>
                      <StyledTableCell>Schedules</StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sliceData(employees, page, rowsPerPage).map((employee) => (
                      <StyledTableRow key={employee.id}>
                        <StyledTableCell padding="checkbox">
                          <Checkbox color="primary" />
                        </StyledTableCell>
                        <StyledTableCell>{employee.name}</StyledTableCell>
                        <StyledTableCell>{employee.phone}</StyledTableCell>
                        <StyledTableCell>${employee.salary}</StyledTableCell>
                        <StyledTableCell>{formatSchedules(employee.schedules)}</StyledTableCell>
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
                count={employees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Box>
      </StyledPaper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newEmployee.phone}
            onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Salary"
            type="number"
            fullWidth
            value={newEmployee.salary}
            onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })}
          />
          {newEmployee.schedules.map((schedule, index) => (
            <Box key={index} mt={2}>
              <Typography variant="subtitle1">Schedule {index + 1}</Typography>
              <FormControl fullWidth margin="dense">
                <InputLabel>Working Day</InputLabel>
                <Select
                  value={schedule.workday}
                  label="Working Day"
                  onChange={(e) => handleScheduleChange(index, 'workday', e.target.value)}
                >
                  {workingDays.map((day) => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography gutterBottom>Working Hours</Typography>
                <Slider
                  value={workingHours}
                  onChange={handleWorkingHoursChange}
                  onChangeCommitted={(e, newValue) => {
                    if (Array.isArray(newValue)) {
                      handleScheduleChange(index, 'workStartTime', formatHour(newValue[0]));
                      handleScheduleChange(index, 'workEndTime', formatHour(newValue[1]));
                    }
                  }}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatHour}
                  step={1}
                  marks
                  min={0}
                  max={24}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatHour(workingHours[0])} - {formatHour(workingHours[1])}
                </Typography>
              </Box>
            </Box>
          ))}
          <Button onClick={handleAddSchedule} sx={{ mt: 2 }}>
            Add Schedule
          </Button>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleClose}>Cancel</StyledButton>
          <StyledButton onClick={handleAddEmployee}>Add</StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;