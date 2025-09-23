import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useForkRef } from '@mui/material/utils';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerFieldProps } from '@mui/x-date-pickers/DatePicker';
import { useParsedFormat, usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers';

type ButtonFieldProps = DatePickerFieldProps;

function ButtonField(props: ButtonFieldProps) {
  const { forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      ref={handleRef}
      size="small"
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content' }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ?? valueStr}
    </Button>
  );
}

interface CustomDatePickerProps {
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null) => void;
}

export default function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  // Avoid SSR hydration mismatch by initializing with null, then setting to today on client
  const [internalValue, setInternalValue] = React.useState<Dayjs | null>(value ?? null);

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    } else {
      setInternalValue(dayjs());
    }
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={internalValue}
        label={internalValue == null ? null : internalValue.format('MMM DD, YYYY')}
        onChange={(newValue) => {
          setInternalValue(newValue);
          if (onChange) onChange(newValue);
        }}
        slots={{ field: ButtonField }}
        slotProps={{
          nextIconButton: { size: 'small' },
          previousIconButton: { size: 'small' },
        }}
        views={['day', 'month', 'year']}
      />
    </LocalizationProvider>
  );
}
