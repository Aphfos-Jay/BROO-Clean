// CustomToolbar.js
import React, { useState } from 'react';
import './CustomToolbar.css';
const CustomToolbar = (props) => {
  const { label, onNavigate, onView, views } = props;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsPopupOpen(false);
    onNavigate('DATE', date); // 선택한 날짜로 이동
  };

  const handlePopupToggle = () => {
    setIsPopupOpen((prev) => !prev);
  };

  return (
    <>
      <div className="customToolbar">
        <button className="prevMonth" onClick={() => onNavigate('PREV')}>
          이전 월
        </button>
        <span className="toolbarSpan" onClick={handlePopupToggle}>
          {label}
        </span>
        {isPopupOpen && (
          <div className="popup">
            <input type="month" onChange={(e) => handleDateSelect(new Date(e.target.value))} style={{ margin: '10px' }} />
            <button style={{ backgroundColor: '#ff7875' }} onClick={handlePopupToggle}>
              닫기
            </button>
          </div>
        )}
        <button class="nextMonth" onClick={() => onNavigate('NEXT')}>
          다음 월
        </button>
      </div>
      <div className="customToolbar popupSection">
        {views.map((view) => (
          <button key={view} onClick={() => onView(view)} style={{ marginLeft: '5px' }}>
            {view === 'month' ? '월' : view === 'week' ? '주' : view === 'day' ? '일' : '일정'}
          </button>
        ))}
      </div>
    </>
  );
};

export default CustomToolbar;
