import { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expensesContext";
import { fetchExpense } from "../util/http";
import Loading from "../components/UI/Loading";
import Error from "../components/UI/Error";

const getDateMinusDays = (date, days) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
};

const RecentExpenses = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState();
  const expenses = useContext(ExpensesContext);

  useEffect(() => {
    const getExpenses = async () => {
      setLoading(true);
      try {
        const expense = await fetchExpense();
        expenses.setExpenses(expense);
      } catch (error) {
        setErrors("Coud not fetch expenses!");
      }
      setLoading(false);
    };
    getExpenses();
  }, []);

  if (errors && !loading) {
    return <Error msg={errors} />;
  }

  if (loading) {
    return <Loading />;
  }

  const recentExpenses = expenses.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return expense.date >= date7DaysAgo && expense.date <= today;
  });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallBackText="No Expenses registered for the last 7 days."
    />
  );
};

export default RecentExpenses;
