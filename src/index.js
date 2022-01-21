const app = require("express")();

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
} = faunadb.query;

app.get("/tweet/:id", async (req, res) => {
  const doc = await client.query(Get(Ref(Collection("tweets"), req.params.id)));

  res.send(doc);
});

app.listen(process.env.PORT || 5001, () =>
  console.log("API on http://localhost:5001")
);
