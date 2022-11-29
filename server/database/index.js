const { isEmpty, set: setDeepValue } = require("lodash");
const { faker } = require("@faker-js/faker");

const Books = require("../models/books");

const getBooksByQuery = async ({
  title,
  author,
  subject,
  startDate,
  endDate,
  page = 1,
  limit = 10,
}) => {
  const filter = {};

  if (!isEmpty(title)) {
    filter.title = { $regex: title, $options: "i" };
  }
  if (!isEmpty(author)) {
    filter.author = { $regex: author, $options: "i" };
  }
  if (!isEmpty(subject)) {
    filter.subject = { $regex: subject, $options: "i" };
  }
  if (!isEmpty(startDate)) {
    setDeepValue(filter, "publishDate.$gte", new Date(startDate));
  }
  if (!isEmpty(endDate)) {
    setDeepValue(filter, "publishDate.$lte", new Date(endDate));
  }

  const [{ books, count }] = await Books.aggregate([
    {
      $match: { ...filter },
    },
    {
      $facet: {
        books: [
          { $sort: { title: 1, author: 1, subject: 1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        count: [{ $count: "count" }],
      },
    },
  ]);

  return { books, booksCount: count[0]?.count };
};

const addMockData = async () => {
  const count = await Books.count();

  if (count >= 100) {
    return;
  }

  const books = [];

  for (let i = 0; i < 1000; i++) {
    books.push({
      insertOne: {
        document: {
          title: faker.music.songName(),
          author: faker.name.fullName(),
          subject: faker.music.genre(),
          publishDate: faker.date.past(10),
        },
      },
    });
  }

  await Books.bulkWrite(books);
};

module.exports = {
  getBooksByQuery,
  addMockData,
};
