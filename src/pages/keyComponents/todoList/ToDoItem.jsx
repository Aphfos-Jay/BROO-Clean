import "./ToDoItem.css";
import { memo } from "react";
const ToDoItem = ({ id, isDone, content, date, onUpdate, onDelete }) => {
  const onChangeCheckbox = () => {
    onUpdate(id);
  };

  const onClickDelete = () => {
    onDelete(id);
  };

  return (
    <div className={!isDone ? "ToDoItem" : "ToDoItemChecked"}>
      <input type="checkbox" checked={isDone} onChange={onChangeCheckbox} />
      <div className="content">{content}</div>
      <div className="date">{new Date(date).toLocaleDateString()}</div>
      <button onClick={onClickDelete}>삭제</button>
    </div>
  );
};

/**
 * 최상위 부모에서 useCallback등을 사용했다면 하위에서는 memo를 그대로 사용해도 됨
 * 하지만 그게 아니라면 객체의 비교는 주소지 비교를 통하기 때문에 렌더링 될때마다 새로운 주소지를 가져서 새로운 값으로 변경된 것으로 인식
 */
export default memo(ToDoItem);
// export default memo(ToDoItem, (prevProps, nextProps) => {
//   /**
//    * 반환값에 따라, Props가 바뀌었는지 안 바뀌었는지 판단
//    * T ==> Props가 바뀌지 않음 ==> 리렌더링 X
//    * F ==> Props가 바뀜 ==> 리렌더링 O
//    */
//   if (prevProps.id !== nextProps.id) {
//     return false;
//   }

//   if (prevProps.isDone !== nextProps.isDone) {
//     return false;
//   }

//   if (prevProps.content !== nextProps.content) {
//     return false;
//   }

//   if (prevProps.date !== nextProps.date) {
//     return false;
//   }

//   return true;
// });
