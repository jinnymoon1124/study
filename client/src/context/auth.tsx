import { createContext, useContext, useReducer, useState } from 'react';
import { User } from '../types';
import { deflate } from 'zlib';

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
});

const DispatchContext = createContext<any>(null);

interface Action {
  type: string;
  payload: any;
}

const reducer = (state: State, { type, payload }: Action) => {
  // type은 어떤 액션인지 페이로드는 사용자정보
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`unknown action type : ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  console.log('state', state);

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

// 굳이 타입을 여기에서 정해주는 이유.... 데이터 보낼 때 편하라고? 여러군데에서 쓰일테니까
// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [state, dispatch] = useReducer(reducer, {
//       user: null,
//       authenticated: false,
//       loading: true,
//     });
//     console.log('state', state);
  
//     return (
//       <DispatchContext.Provider value={dispatch}>
//         <StateContext.Provider value={state}>{children}</StateContext.Provider>
//       </DispatchContext.Provider>
//     );
//   };

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
