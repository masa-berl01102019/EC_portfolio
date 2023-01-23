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
          disableToolbar // 年月日の選択時に上部に選択されるtoolbarを非表示にする
          variant="dialog" // modal形式でのカレンダーの表示
          inputVariant="outlined" // inputっぽい表示
          openTo="year" // カレンダーアイコンクリック時に年->月->日の順に選択出来るように設定
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