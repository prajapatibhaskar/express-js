import fs from "fs";

export function writeUsersToFile(updatedUsersArray) {
  // convert updated users array to JSON string
  const updatedData = JSON.stringify(updatedUsersArray, null, 2);

  // Write updated users array to a db.js file
  fs.writeFileSync(
    "./utils/db.js",
    `export const users = ${updatedData}`,
    "utf-8"
  );
}