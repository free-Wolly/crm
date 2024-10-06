import { Schedule } from '../interfaces';
import { formatHour } from './formHelpers';

export const formatSchedules = (schedules: Schedule[] | undefined): string => {
  if (!schedules || schedules.length === 0) {
    return 'No schedules';
  }
  return schedules.map(schedule => 
    `${schedule.workday} ${schedule.workStartTime} - ${schedule.workEndTime}`
  ).join(', ');
};

export const createNewSchedule = (workingHours: number[]): Schedule => ({
  workday: '',
  workStartTime: formatHour(workingHours[0]),
  workEndTime: formatHour(workingHours[1])
});