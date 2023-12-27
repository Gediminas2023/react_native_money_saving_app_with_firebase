import { useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expensesContext";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { storeExpense, updateExpense, deleteExpense } from "../util/http";
import Loading from "../components/UI/Loading";
import Error from "../components/UI/Error";

const ManageExpense = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();
  const expensesContext = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesContext.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  const deleteExpenses = async () => {
    setLoading(true);
    try {
      expensesContext.deleteExpenses(editedExpenseId);
      await deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setErrors("Could not delete expenses - please try again later");
      setLoading(false);
    }
  };
  const cancelExpenses = () => {
    navigation.goBack();
  };
  const confirmExpenses = async (expenseData) => {
    setLoading(true);
    try {
      if (isEditing) {
        expensesContext.updateExpenses(editedExpenseId, expenseData);
        await updateExpense(editedExpenseId, expenseData);
      } else {
        const id = await storeExpense(expenseData);
        expensesContext.addExpenses({ ...expenseData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setErrors("Could not save data - please try again later!");
      setLoading(false);
    }
  };

  if (errors && !loading) {
    return <Error msg={errors} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        onCancel={cancelExpenses}
        submitButtonLable={isEditing ? "Update" : "Add"}
        onSubmit={confirmExpenses}
        defaultValue={selectedExpense}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon={"trash"}
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenses}
          />
        </View>
      )}
    </View>
  );
};

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    boederTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
