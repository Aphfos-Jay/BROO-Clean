import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MonthlyAccidents from './MonthlyAccidents';
import MainCard from 'components/MainCard';

export default function MonthlyAccidentsReportCard() {
  const [value, setValue] = useState('year');

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Accident Monthly Report</Typography>
        </Grid>
        <Grid item></Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <MonthlyAccidents />
      </MainCard>
    </>
  );
}
