import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { theme } from '../constants/theme';

LocaleConfig.locales['it'] = {
  monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
  monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],
  dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
  dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
  today: 'Oggi'
};
LocaleConfig.defaultLocale = 'it';

export default function PrivateCalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario</Text>
      <View style={styles.bentoCard}>
        <Calendar
          theme={{
            calendarBackground: theme.colors.cardBackground,
            textSectionTitleColor: theme.colors.textSecondary,
            selectedDayBackgroundColor: theme.colors.primaryPrivate,
            selectedDayTextColor: '#ffffff',
            todayTextColor: theme.colors.primaryPrivate,
            dayTextColor: theme.colors.textMain,
            textDisabledColor: theme.colors.textSecondary,
            arrowColor: theme.colors.primaryPrivate,
            monthTextColor: theme.colors.textMain,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.privateBackground,
    padding: theme.spacing.l,
    paddingTop: theme.spacing.l * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primaryPrivate,
    marginBottom: theme.spacing.m,
  },
  bentoCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.s,
    overflow: 'hidden',
  },
});