// project import
import AuthWrapperNoFooter from './AuthWrapperNoFooter';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ================================|| LOGIN ||================================ //

export default function Privacy() {
  return (
    <div>
      <AuthWrapperNoFooter>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: 0.5, sm: 0.5 } }}>
              <Typography variant="h3">1. 개요</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                본 개인정보처리방침은 BROO-Clean시스템이 고객의 개인정보를 어떻게 수집, 사용, 보호하는지에 대한 정보를 제공합니다. 우리는
                GDPR 규정을 준수하며, 고객의 개인정보 보호를 최우선으로 합니다.
              </Typography>
            </Stack>
            <br />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">2. 개인정보의 수집</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                - 사용자가 [회사명] 웹사이트를 방문할 때 자동으로 수집되는 정보 (예: IP 주소, 방문 날짜 및 시간) <br />- 고객이 서비스 이용
                과정에서 직접 제공하는 정보 (예: 이름, 이메일 주소)
              </Typography>
            </Stack>
            <br />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">3. 개인정보의 사용 목적</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                - 서비스 제공 및 개선 <br />
                - 사용자 경험 향상 <br />- 마케팅 및 광고 목적
              </Typography>
            </Stack>
            <br />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">4. 개인정보의 공유 및 전송</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                - BROO-CLEAN은(는) 사용자의 개인정보를 제3자와 공유하지 않습니다. <br />- 예외적으로 법적 요구가 있을 경우 정보를 공개할 수
                있습니다.
              </Typography>
            </Stack>
            <br />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">5. 데이터 보안</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                - 최신 보안 기술을 사용하여 사용자의 데이터를 안전하게 보호합니다.
                <br />- 정기적인 보안 감사 및 업데이트를 실시합니다.
              </Typography>
            </Stack>
            <br />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">6. 사용자 권리</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                - 개인정보 접근 및 정정 요구 권리
                <br />- 데이터 삭제 요구 권리 <br />- 데이터 처리에 대한 동의 철회
              </Typography>
            </Stack>
            <br />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">7. 개인정보 보호 담당자</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                - 이름: 장재원
                <br /> - 연락처: 010-7252-7851 <br />- email: gomgun2@naver.com
              </Typography>
            </Stack>
            <br />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">8. 개인정보처리방침 변경</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="body1" sx={{ textDecoration: 'none' }}>
                - 본 방침은 2024-10-22에 갱신되었습니다.
                <br /> -변경 사항 발생 시 웹사이트를 통해 공지됩니다.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </AuthWrapperNoFooter>
    </div>
  );
}
