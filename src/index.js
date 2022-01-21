const express = require("express");

const app = express();

app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const faunadb = require("faunadb");

const client = new faunadb.Client({
  secret: process.env.FAUNA_DB_SECRET,
  domain: "db.us.fauna.com",
  port: 443,
});

const {
  Paginate,
  Get,
  Select,
  Match,
  Index,
  Create,
  Collection,
  Lambda,
  Var,
  Join,
  Ref,
  Call,
  Function: Fn,
} = faunadb.query;

// get tweet by id
app.get("/tweet/:id", async (req, res) => {
  const doc = await client.query(Get(Ref(Collection("tweets"), req.params.id)));

  res.send(doc);
});

// create tweet for user
app.post("/tweet", async (req, res) => {
  if (!req?.body?.userName) {
    res.send({ error: { userName: "cannot be empty" } }, 400);
  }

  if (!req?.body?.text) {
    res.send({ error: { text: "cannot be empty" } }, 400);
  }

  const data = {
    user: Call(Fn("getUser"), req.body.userName),
    text: req.body.text,
  };

  const doc = await client
    .query(Create(Collection("tweets"), { data }))
    .catch((e) => {
      res.send(
        {
          error: {
            description:
              "Something went wrong! You've probably enter invalid userName",
          },
        },
        500
      );
    });

  res.send(doc);
});

// get all tweet by user
app.get("/tweet", async (req, res) => {
  if (!req?.body?.userName) {
    res.send({ error: { userName: "cannot be empty" } }, 400);
  }

  const doc = await client
    .query(
      Paginate(
        Match(Index("tweetsByUser"), Call(Fn("getUser"), req.body.userName))
      )
    )
    .catch((e) => {
      res.send(
        {
          error: {
            description:
              "Something went wrong! You've probably enter invalid userName",
          },
        },
        500
      );
    });

  res.send(doc);
});

// create followers for user
app.post("/relationship", async (req, res) => {
  if (!req?.body?.follower) {
    res.send({ error: { follower: "cannot be empty" } }, 400);
  }

  if (!req?.body?.followee) {
    res.send({ error: { followee: "cannot be empty" } }, 400);
  }

  const data = {
    follower: Call(Fn("getUser"), req.body.follower),
    followee: Call(Fn("getUser"), req.body.followee),
  };

  const doc = await client
    .query(Create(Collection("relationships"), { data }))
    .catch((e) => {
      console.log(e);
      res.send(
        {
          error: {
            description:
              "Something went wrong! You've probably enter invalid user(s)",
          },
        },
        500
      );
    });

  res.send(doc);
});

app.listen(process.env.PORT || 5001, () =>
  console.log("API on http://localhost:5001")
);
