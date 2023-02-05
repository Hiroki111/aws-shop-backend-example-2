import { Readable } from "stream";
import csvParser from "csv-parser";

export const parseCsvStream = (stream: Readable): Promise<Array<any>> => {
  return new Promise((resolve, reject) => {
    const data = [];
    stream
      .pipe(csvParser())
      .on("data", (record) => {
        data.push(record);
      })
      .on("error", reject)
      .on("end", () => {
        resolve(data);
      });
  });
};
