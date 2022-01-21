const app = require("express")();

const faunadb = require("faunadb");

const client = new faunadb.Client({ secret: process.env.FAUNA_DB_SECRET });

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
} = faunadb.query;

app.listen(process.env.PORT || 5001, () =>
  console.log("API on http://localhost:5001")
);
