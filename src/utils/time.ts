import { Caption } from "../types";

export const getTimeString = (secTotal: number, showMilliSeconds = true) => {
  const hours = Math.floor(secTotal / 3600); // get hours
  const  minutes = Math.floor((secTotal - hours * 3600) / 60); // get minutes
  const  seconds = secTotal - hours * 3600 - minutes * 60; //  get seconds
  let hoursStr = hours.toString()
  let minutesStr = minutes.toString()
  let secondsStr = seconds.toString()
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hoursStr = "0" + hours;
  }
  if (minutes < 10) {
    minutesStr = "0" + minutes;
  }
  if (seconds < 10) {
    secondsStr = "0" + seconds;
  }
  let maltissaRegex = /\..*$/; // matches the decimal point and the digits after it e.g if the number is 4.567 it matches .567

  let millisec = String(seconds).match(maltissaRegex);
  return (
    hoursStr +
    ":" +
    minutesStr +
    ":" +
    String(secondsStr).replace(maltissaRegex, "") +
    (showMilliSeconds ? (millisec ? millisec[0] : ".000") : "")
  );
};

export const getCaptionDurationString = (caption: Caption) => {
  const start = new Date(caption.startTime * 1000).toISOString().slice(11, 19);
  const end = new Date(caption.endTime * 1000).toISOString().slice(11, 19);
  return `${start} - ${end}`
}