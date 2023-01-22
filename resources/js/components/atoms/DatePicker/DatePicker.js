import React from "react";
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from "date-fns/locale/ja";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
// import { styles } from '@material-ui/pickers/views/Calendar/Calendar';


const DatePicker = ({name, value, onChange, ...props}) => {

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
      <KeyboardDatePicker
          id={name}
          format='yyyy/MM/dd'
          disableToolbar // Hide unnecessary toolbar
          variant="dialog" // Type of calendar
          inputVariant="outlined" // display like a input form
          openTo="year" // It can select in order of year→month→day when calendar icon is clicked
          views={["year", "month", "date"]}
          value={value}
          onChange={e => {
            onChange(e, name)
          }}
          placeholder='1991/01/01'
          {...props}
      />
   </MuiPickersUtilsProvider>
  );
};

export default DatePicker;