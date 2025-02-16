import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["m-drive_*"],
  dbCredentials: {
    host: "svc-7ba08cfa-3e59-458b-b9ae-ae06a80aaa95-dml.aws-virginia-8.svc.singlestore.com",
    user: "admin",
    password: "WXDf02Wq9I6LhqPVYq5UvCqMW6zW7J3i",
    port: 3306,
    database: "M_DRIVE_DB",
    ssl: {},
},
} satisfies Config;
