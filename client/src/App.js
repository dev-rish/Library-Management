import isEmpty from "lodash.isempty";
import debounce from "lodash.debounce";
import {
  Table,
  Container,
  Card,
  CardBody,
  Input,
  Row,
  Button,
  CardHeader,
} from "reactstrap";
import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InfiniteScroll from "react-infinite-scroll-component";

import { fetchBooks } from "./utils";

function App() {
  const [booksData, setBooksData] = useState({
    booksCount: 0,
    books: [],
  });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const debouncedFetchBooks = useCallback(
    debounce(
      ({ page, ...rest }) => {
        fetchBooks({ page, ...rest }).then((newData) => {
          if (page === 1) {
            setBooksData(newData);
          } else {
            setBooksData((oldData) => ({
              ...newData,
              books: [...oldData.books, ...newData.books],
            }));
          }
          setPage(page);
        });
      },
      500,
      { leading: true }
    ),
    []
  );

  useEffect(() => {
    debouncedFetchBooks({ ...filters, page: 1 });
  }, [filters]);

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFilters({ ...filters, [field]: value });
  };

  const handleDateChange = (type, date) => {
    setFilters({ ...filters, [type]: date });
  };

  const renderInputFields = () => {
    return (
      <tr className="align-middle">
        <th></th>
        <th>
          <Input
            value={filters["title"]}
            onChange={(e) => handleInputChange(e, "title")}
          />
        </th>
        <th>
          <Input
            value={filters["author"]}
            onChange={(e) => handleInputChange(e, "author")}
          />
        </th>
        <th>
          <Input
            value={filters["subject"]}
            onChange={(e) => handleInputChange(e, "subject")}
          />
        </th>
        <th>
          <Row className="justify-content-center">
            <div className="w-50">
              <DatePicker
                className="form-control mb-1"
                placeholderText="From"
                isClearable
                showYearPicker
                dateFormat="yyyy"
                selected={filters["startDate"]}
                onChange={(date) => handleDateChange("startDate", date)}
              />
            </div>
          </Row>
          <Row className="justify-content-center">
            <div className="w-50">
              <DatePicker
                className="form-control"
                placeholderText="To"
                isClearable
                showYearPicker
                dateFormat="yyyy"
                selected={filters["endDate"]}
                onChange={(date) => handleDateChange("endDate", date)}
              />
            </div>
          </Row>
        </th>
      </tr>
    );
  };

  const renderBooks = () => {
    return booksData.books.map(
      ({ _id, title, author, subject, publishDate }, i) => (
        <tr key={_id}>
          <th scope="row">
            <div className="m-2">{i + 1}</div>
          </th>
          <td>{title}</td>
          <td>{author}</td>
          <td>{subject}</td>
          <td>
            {new Date(publishDate).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            })}
          </td>
        </tr>
      )
    );
  };

  return (
    <>
      <InfiniteScroll
        dataLength={booksData.books.length}
        next={() => debouncedFetchBooks({ ...filters, page: page + 1 })}
        hasMore={booksData?.booksCount > booksData?.books?.length}
      >
        <Container className="my-2">
          <Card>
            <CardHeader className="text-center fs-3">{booksData.booksCount || 0} result(s) found</CardHeader>
            <CardBody>
              <Table striped className="text-center align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Subject</th>
                    <th>Publish Date</th>
                  </tr>
                  {renderInputFields()}
                </thead>
                <tbody>
                  {isEmpty(booksData?.books) ? (
                    <tr className="text-center">
                      <td colSpan={5}>No matching books</td>
                    </tr>
                  ) : (
                    renderBooks()
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Container>
      </InfiniteScroll>
      {window.scrollY > 200 && (
        <Button
          color="secondary fs-3"
          className="rounded-5"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
          }}
        >
          ↑
        </Button>
      )}
    </>
  );
}

export default App;
