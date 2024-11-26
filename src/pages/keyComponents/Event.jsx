import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'moment/locale/ko';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './eventManage/Event.css';
import CustomToolbar from './eventManage/CustomToolbar';

moment.locale('ko');
const localizer = momentLocalizer(moment);
Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: '1000'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: '999'
  }
};

const eventData = {
  start: new Date(),
  end: new Date(),
  title: '',
  description: ''
};

const messages = {
  next: '다음',
  previous: '이전',
  today: '오늘',
  month: '월',
  week: '주',
  day: '일',
  agenda: '일정',
  date: '날짜',
  time: '시간',
  event: '이벤트',
  noEventsInRange: '이 기간에 이벤트가 없습니다.',
  showMore: (total) => `+ 더 보기 (${total})`
};

const formats = {
  monthHeaderFormat: 'YYYY년 MM월', // 월 헤더 형식
  dayHeaderFormat: 'MM월 DD일 dddd', // 일 헤더 형식
  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, 'M월 D일', culture)} - ${localizer.format(end, 'M월 D일', culture)}` // 날짜 범위 형식
};

export default function Event() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState(eventData);

  // Event 창이 열릴 때 딱 1번 실행 후 셋팅
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events'));
    console.log('storedEvents ==> ' + JSON.stringify(storedEvents));

    if (storedEvents) {
      const convertedEvents = storedEvents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      setEvents(convertedEvents);
    }
  }, []);

  // events가 setEvents메소드로 변동이 될 때마다 실행
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // 이벤트 생성
  const handleCreateEvent = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setSelectedEvent(null); // 새 이벤트 등록일 때는 선택된 이벤트 초기화
    setModalIsOpen(true);
  };

  // 이벤트 수정
  const handleUpdateEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({ ...event });
    setModalIsOpen(true);
  };

  // 팝업에서 새 이벤트 등록 또는 수정
  const handleSaveEvent = () => {
    if (selectedEvent) {
      // 기존 이벤트 수정
      const updatedEvents = events.map((event) => (event === selectedEvent ? newEvent : event));
      setEvents(updatedEvents);
    } else {
      // 새 이벤트 등록
      setEvents([...events, newEvent]);
    }
    setModalIsOpen(false);
  };

  // 이벤트 삭제
  const handleDeleteEvent = () => {
    const deletingEvents = events.filter((event) => event !== selectedEvent);
    setEvents(deletingEvents);
    setNewEvent(eventData);
    setModalIsOpen(false);
  };

  const handleOnChange = (event) => {
    const name = event.target.name;
    if (name !== 'start' && name !== 'end') {
      setNewEvent({ ...newEvent, [name]: event.target.value });
    } else {
      setNewEvent({ ...newEvent, [name]: new Date(event.target.value) });
    }
  };

  return (
    <div className="App">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        style={{ height: '100vh' }}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleCreateEvent}
        onSelectEvent={handleUpdateEvent}
        messages={messages}
        formats={formats}
        components={{
          toolbar: CustomToolbar // 커스텀 툴바 적용
        }}
      />

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
        <h2 className="popupH2">{selectedEvent ? '일정 수정' : '일정 등록'}</h2>
        <form>
          <label>
            주제
            <input className="popupSubject" type="text" name="title" value={newEvent.title} onChange={handleOnChange} />
          </label>

          <label>
            설명
            <textarea className="popupDescription" name="description" value={newEvent.description} onChange={handleOnChange} />
          </label>

          <label>
            시작일:
            <input
              className="popupDateInput"
              type="datetime-local"
              name="start"
              value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
              onChange={handleOnChange}
            />
          </label>

          <label>
            종료일:
            <input
              className="popupDateInput"
              type="datetime-local"
              name="end"
              value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
              onChange={handleOnChange}
            />
          </label>

          <div className="popupBtnArea">
            <button className="popupBtnSave" type="button" onClick={handleSaveEvent}>
              {selectedEvent ? '일정 수정' : '일정 등록'}
            </button>

            {selectedEvent && (
              <button className="popupBtnDelete" type="button" onClick={handleDeleteEvent}>
                Delete Event
              </button>
            )}
            <button className="popupBtnCancel" type="button" onClick={() => setModalIsOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
