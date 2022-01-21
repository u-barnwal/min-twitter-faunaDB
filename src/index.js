const app = require("express")();

const faunadb = require("faunadb");

const client = new faunadb.Client({
  secret: "fnAEdfUHCUAAQsTE-EgldKuTkUOlNhw9Nk9Qf3jr",
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
