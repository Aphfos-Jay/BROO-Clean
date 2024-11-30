import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';

export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDetailsClick = () => {
    setExpanded(false);
  };

  const pdfList = [{ id: 1, title: '개발계획서', file: 'Development_Plan.pdf' }];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Home(About BROO-Clean)
      </Typography>
      {pdfList.map((pdf) => (
        <Accordion key={pdf.id} expanded={expanded === pdf.id} onChange={handleChange(pdf.id)}>
          <AccordionSummary>
            <Typography variant="h6">{pdf.title}</Typography>
          </AccordionSummary>
          <AccordionDetails
            onClick={handleDetailsClick} // 디테일 영역 클릭 시 닫히도록 처리
            style={{ cursor: 'pointer' }} // 클릭 가능하다는 시각적 표시
          >
            {expanded === pdf.id && ( // 열렸을 때만 렌더링
              <Document file={pdf.file} onLoadSuccess={onDocumentLoadSuccess} loading="Loading PDF...">
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
