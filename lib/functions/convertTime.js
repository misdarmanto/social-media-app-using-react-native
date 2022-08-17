function makeHumanReadable(num, singular) {
  return num > 0 ? num + (num === 1 ? ` ${singular} ` : ` ${singular}s `) : "";
}

export function convertTimeToString(secondValues) {
  const currentDateTimeInSecond = Date.now() / 1000;
  const currentDateTime = currentDateTimeInSecond - secondValues;

  const seconds = Math.floor(currentDateTime % 60);
  const minutes = Math.floor((currentDateTime % 3600) / 60);
  const hours = Math.floor((currentDateTime % (3600 * 24)) / 3600);
  const days = Math.floor(currentDateTime / (3600 * 24));

  if (days !== 0) {
    const daysStr = makeHumanReadable(days, "day");
    return `${daysStr}`.replace(/,\s*$/, "");
  } else if (hours !== 0) {
    const hoursStr = makeHumanReadable(hours, "hour");
    return `${hoursStr}`.replace(/,\s*$/, "");
  } else if (minutes !== 0) {
    const minutesStr = makeHumanReadable(minutes, "minute");
    return `${minutesStr}`.replace(/,\s*$/, "");
  } else if (seconds !== 0) {
    const secondsStr = makeHumanReadable(seconds, "second");
    return `${secondsStr}`.replace(/,\s*$/, "");
  } else {
    const defaultDate = new Date(secondValues * 1000).toDateString();
    return `${defaultDate}`.replace(/,\s*$/, "");
  }
}
