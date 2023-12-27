import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
  expenses: [],
  addExpenses: ({ description, amount, date }) => {},
  deleteExpenses: (id) => {},
  setExpenses: (expenses) => {},
  updateExpenses: (id, { description, amount, date }) => {},
});

const expensesReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "SET":
      const inverted = action.payload.reverse();
      return inverted;
    case "UPDATE":
      const updateIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updateExpenses = state[updateIndex];
      const updateItem = { ...updateExpenses, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updateIndex] = updateItem;
      return updatedExpenses;
    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
};

const ExpensesContextProvider = ({ children }) => {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  const addExpenses = (expensesDate) => {
    dispatch({ type: "ADD", payload: expensesDate });
  };

  const setExpenses = (expenses) => {
    dispatch({ type: "SET", payload: expenses });
  };

  const deleteExpenses = (id) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const updateExpenses = (id, expensesDate) => {
    dispatch({ type: "UPDATE", payload: { id: id, data: expensesDate } });
  };

  const value = {
    expenses: expensesState,
    addExpenses: addExpenses,
    setExpenses: setExpenses,
    deleteExpenses: deleteExpenses,
    updateExpenses: updateExpenses,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};

export default ExpensesContextProvider;
