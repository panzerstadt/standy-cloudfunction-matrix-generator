const dayjs = require("dayjs");
const minMax = require("dayjs/plugin/minMax");
require("dayjs/locale/ja");
dayjs.locale("ja");
dayjs.extend(minMax);

const getUserTime = data => {
  const day = dayjs(data[0].date).format("YYYY-MM-DD");

  console.log(data);
  const times_dayjs = data.map(d => dayjs(day + ":" + d.time));

  const originals = data.map(d => d.departureTime);
  const originalTime = Array.from(new Set(originals))[0]; // TODO: handle multiple departureTime check
  const original_dayjs = dayjs(day + ":" + originalTime);

  const offPeakStartTime = dayjs.min(times_dayjs);
  const offPeakEndTime = dayjs.max(times_dayjs);

  const originalStartTime = original_dayjs;
  const period = offPeakEndTime - offPeakStartTime;
  const originalEndTime = original_dayjs.add(period);

  const out = dayjsTime => dayjsTime.format("HH:mm");

  return {
    offPeak: {
      start: out(offPeakStartTime),
      end: out(offPeakEndTime)
    },
    original: {
      start: out(originalStartTime),
      end: out(originalEndTime)
    }
  };
};

module.exports = getUserTime;
