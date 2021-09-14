export const initialState = null;
export const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return action.payload;
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      rooms: action.payload.rooms,
     
    };
  }
  if (action) {
    return state;
  }
};
