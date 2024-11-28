// material-ui

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

//brooclean Chart
import MainCard from 'components/MainCard';
import ReportSummary from './ReportSummary';
import MonthlyAccidentsReportCard from './MonthlyAccidentsReportCard';
import CasualtiesChart from './CasualtiesChart';
import TrashTable from './TrashTable';
import AccidentChart from './AccidentChart';
import ShipUsageDoughnutChart from './ShipUsageDoughnutChart';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Dashboard() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1  Summary*/}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Summary</Typography>
      </Grid>

      <Grid item xs={12} sm={12}>
        <ReportSummary />
      </Grid>

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">쓰레기 수거량</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <TrashTable />
        </MainCard>
      </Grid>

      {/* row 2 Accident Monthly Report, Casualties Report */}
      <Grid item xs={12} md={7} lg={7}>
        <MonthlyAccidentsReportCard />
      </Grid>

      <Grid item xs={12} md={5} lg={5}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Casualties Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <CasualtiesChart />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={8} lg={7.8}>
        <Grid item>
          <Typography variant="h5">영역별 사고 현황</Typography>
        </Grid>

        <AccidentChart />
      </Grid>
      <Grid item xs={12} md={5} lg={4.1}>
        <Grid item>
          <Typography variant="h5">선박별 사고 비중</Typography>
        </Grid>
        <MainCard>
          <ShipUsageDoughnutChart />
        </MainCard>
      </Grid>

      {/* row 4 */}
    </Grid>
  );
}
