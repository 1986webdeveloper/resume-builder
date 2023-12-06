import mongoose from "mongoose";

const host = process.env.DB_HOST || "";
const port = process.env.DB_PORT || "";
const db_name = process.env.DATABASE || "";

const db_uri = `mongodb://${host}:${port}/${db_name}`;

mongoose
  .connect(db_uri, {
    autoIndex: true,
    autoCreate: true,
  })
  .then(() => {
    console.log("connection to database : " + db_name);
  })
  .catch((error) => {
    console.log("Database not connected");
  });
