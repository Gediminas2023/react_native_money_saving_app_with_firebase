import { useContext } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expensesContext";

const AllExpenses = () => {
  const expenses = useContext(ExpensesContext);
  return (
    <ExpensesOutput
      expenses={expenses.expenses}
      expensesPeriod="Total"
      fallBackText="No registered expenses found!"
    />
  );
};

export default AllExpenses;
