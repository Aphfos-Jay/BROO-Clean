/**
 * Section09
 * useReducer
 * 리액트에서 state를 관리할 때 배열안에 객체가 들어간것처럼 복잡한 경우 reducer를 이용
 * 간단한 state 관리는 useState이용
 */

import { useReducer } from "react";

//-> 상태를 실제로 변환시키는 변환기 역할로 직접 커스텀해야 한다.
function reducer(state, action) {
  console.log(state, action);

  switch (action.type) {
    case "INCREASE":
      return state + action.data;
    case "DECREASE":
      return state - action.data;
  }
}

const Exam = () => {
  //dispatch ==> 상태 변화가 있어야 한다는 사실을 알리는 혹은 요청하는 함수
  const [state, dispatch] = useReducer(reducer, 0);

  const onClickPlus = () => {
    //파라미터: 상태가 어떻게 변화되길 원하는지
    // 인수의 정보를 담고 있는 객체를 액션 개체라고 함
    // dispatch는 정의된 reducer함수를 실행시킴
    dispatch({
      type: "INCREASE",
      data: 1,
    });
  };

  const onClickMinus = () => {
    //파라미터: 상태가 어떻게 변화되길 원하는지
    // 인수의 정보를 담고 있는 객체를 액션 개체라고 함
    // dispatch는 정의된 reducer함수를 실행시킴
    dispatch({
      type: "DECREASE",
      data: 1,
    });
  };

  return (
    <div>
      <h1>{state}</h1>
      <button onClick={onClickPlus}>+</button>
      <button onClick={onClickMinus}>-</button>
    </div>
  );
};

export default Exam;
