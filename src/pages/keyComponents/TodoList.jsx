import MainCard from 'components/MainCard';
import Header from './todoList/Header';
import List from './todoList/List';
import Editor from './todoList/Editor';
import './todoList/Todolist.css';
import { useRef, useReducer, useCallback, useEffect } from 'react';

function reducer(state, action) {
  let nextState;

  switch (action.type) {
    case 'CREATE':
      nextState = [action.data, ...state];
      break;
    case 'UPDATE':
      nextState = state.map((item) => (item.id === action.data ? { ...item, isDone: !item.isDone } : item));
      break;
    case 'DELETE':
      nextState = state.filter((item) => item.id !== action.data);
      break;
    case 'INIT':
      return action.data;
    default:
      return state;
  }

  localStorage.setItem('Brooclean_Todo', JSON.stringify(nextState));
  return nextState;
}

const mockData = [
  {
    id: 0,
    isDone: false,
    content: '김태규 대리, 최지용 대리 미팅 - 해양 환경 시스템 브루클린 도입 건',
    date: new Date('2024-11-08').getTime()
  },
  {
    id: 1,
    isDone: true,
    content: '김상기 과장에게 17시까지 자료 전달하기로 하였음',
    date: new Date('2024-11-07').getTime()
  }
];

export default function TodoList() {
  const [todos, dispatch] = useReducer(reducer, mockData);
  const idRef = useRef(2);

  useEffect(() => {
    const storedData = localStorage.getItem('Brooclean_Todo');
    console.log('storedData ==>', storedData);
    if (!storedData) {
      return;
    }

    const parsedData = JSON.parse(storedData);

    let maxId = 0;
    parsedData.forEach((item) => {
      if (Number(item.id) > maxId) {
        maxId = Number(item.id);
      }
    });

    idRef.current = maxId + 1;
    dispatch({
      type: 'INIT',
      data: parsedData
    });
  }, []);

  const onCreate = useCallback((content) => {
    dispatch({
      type: 'CREATE',
      data: {
        id: idRef.current++,
        isDone: false,
        content: content,
        date: new Date().getTime()
      }
    });
  }, []);

  const onUpdate = useCallback((targetId) => {
    dispatch({
      type: 'UPDATE',
      data: targetId
    });
  }, []);

  const onDelete = useCallback((targetId) => {
    dispatch({
      type: 'DELETE',
      data: targetId
    });
  }, []);

  return (
    <MainCard>
      <div className="todoApp">
        <Header />
        <Editor onCreate={onCreate} />
        <List todos={todos} onUpdate={onUpdate} onDelete={onDelete} />
      </div>
    </MainCard>
  );
}
