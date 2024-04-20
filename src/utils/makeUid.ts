import { formatInTimeZone } from "date-fns-tz";

export const makeId = (prefix: string, length: number = 6) => {
  let result = "";
  const characters = "ABCDEF0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const date = formatInTimeZone(new Date(), timezone, "ddMMyy");

  console.log(date, result);

  return `${prefix.toLocaleUpperCase()}-${date}${result}`;
};
