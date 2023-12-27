import axios from "axios";

const URL = "https://expenses-app-95153-default-rtdb.firebaseio.com";

export const storeExpense = async (expenseData) => {
  const res = await axios.post(URL + "/expenses.json", expenseData);
  const id = res.data.name;
  return id;
};

export const fetchExpense = async () => {
  const response = await axios.get(URL + "/expenses.json");

  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }
  return expenses;
};

export const updateExpense = (id, expenseData) => {
  return axios.put(URL + `/expenses/${id}.json`, expenseData);
};

export const deleteExpense = async (id) => {
  await axios.delete(URL + `/expenses/${id}.json`);
};
