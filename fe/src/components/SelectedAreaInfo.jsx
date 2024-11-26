import React from 'react';
import { styles } from '../styles/styles';

const SelectedAreaInfo = ({ selectedArea }) => (
  <div style={styles.infoBox}>
    <h2 style={styles.infoText}>{`${selectedArea}를 클릭했습니다.`}</h2>
  </div>
);

export default SelectedAreaInfo;