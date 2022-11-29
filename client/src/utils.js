import axios from "axios";

export const test = () => 1;

export const fetchBooks = (filters) =>
  axios({
    method: "POST",
    url: "/api/get-books",
    data: filters,
  })
    .then(({ data }) => data)
    .catch((err) => console.log(err.message) || {});
