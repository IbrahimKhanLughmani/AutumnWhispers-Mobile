import React, { useEffect } from 'react';
import {View} from 'react-native';
import {LocaleConfig} from 'react-native-calendars';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

export default Calender = ({markDate, setMarkDate}) => {
    var date = new Date()

    useEffect(()=>{
      setMarkDate(moment(new Date()).format("YYYY-MM-DD"))
    }, [])
    
    const mark = {
      [markDate] : {selected: true}
		};

    LocaleConfig.locales['en'] = {
        monthNames: ['January','Februry','March','April','May','June','July','August','September','October','November','December'],
        monthNamesShort: ['Jan.','Feb.','Mar','Apr','May','June','July.','Aug','Sept.','Oct.','Nov.','Dec.'],
        dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        dayNamesShort: ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'],
        today: 'Pakistan'
      };
    LocaleConfig.defaultLocale = 'en';

    return(
        <View >
            <Calendar
              style={{ borderRadius: 10}}
              theme={{
                textSectionTitleDisabledColor: '#d9e1e8',
                selectedDayTextColor: '#ffffff',
                todayTextColor: 'blue',
                selectedDayBackgroundColor: '#343c71',
                arrowColor: '#343c71',
                disabledArrowColor: 'white',
                monthTextColor: 'black',
              }}
              minDate={date}
              hideExtraDays={true}
              onPressArrowLeft={subtractMonth => subtractMonth()}
              onPressArrowRight={addMonth => addMonth()}
              onDayPress={(day) => {
                setMarkDate(day.dateString)
              }}
              markedDates={mark}         
            />
        </View>
    )
};