const { Router } = require("express");
const { getBooksByQuery, addMockData } = require("../database");
const { faker } = require("@faker-js/faker");

const router = Router();

router.get("/api/", async (req, res) => {
  res.send({
    title: faker.music.songName(),
    author: faker.name.fullName(),
    subject: faker.music.genre(),
    publishDate: faker.date.past(10),
  });
});

router.post("/api/add-mock-data", async (req, res) => {
  await addMockData();
  res.send();
});

router.post("/api/get-books", async (req, res) => {
  try {
    res.send(await getBooksByQuery(req.body));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
