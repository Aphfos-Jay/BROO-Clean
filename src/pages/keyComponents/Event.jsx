import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import './Event.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const state = {
  events: [
    {
      start: moment().toDate(),
      end: moment().add(1, 'days').toDate(),
      title: 'Some title'
    }
  ]
};

export default function Event(props) {
  return (
    <MainCard title="">
      <div className="App">
        <Calendar localizer={localizer} defaultDate={new Date()} defaultView="month" events={state.events} style={{ height: '100vh' }} />
      </div>
    </MainCard>
  );
}
