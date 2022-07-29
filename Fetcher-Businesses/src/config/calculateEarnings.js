const getYearOutOfDate = (date) => {
  return parseInt(date.substr(date.length - 4, 4));
};
const getDayOutOfDate = (date) => {
  return parseInt(date.substring(date.indexOf("/"), date.length - 5));
};
const getMonthOutOfDate = (date) => {
  return parseInt(date.substring(0, date.indexOf("/")));
};

const fixDate = (dateString) => {
  let nums = [];
  for (let i = 0; i < 2; i++) {
    nums.push(dateString.substring(0, dateString.indexOf("/")));
    dateString = dateString.substring(dateString.indexOf("/") + 1);
  }
  nums[2] = dateString;
  if (nums[0].substring(0, 1) === "0") {
    nums[0] = nums[0].substring(1);
  }
  if (nums[1].substring(0, 1) === "0") {
    nums[1] = nums[1].substring(1);
  }
  if (nums[2].length < 4) {
    nums[2] = "20" + nums[2];
  }
  return nums[0] + "/" + nums[1] + "/" + nums[2];
};

const calculateEarnings = (earnings) => {
  let today = new Date();
  let currWeek = [];
  for (let i = 0; i < today.getDay(); i++) {
    currWeek.unshift(
      fixDate(new Date(today - 60 * 24 * (i + 1) * 60000).toLocaleDateString())
    );
  }
  currWeek.push(fixDate(today.toLocaleDateString()));
  let lastSeven = [];
  for (let i = earnings[earnings.length - 1].earnings.length - 1; i >= 0; i--) {
    lastSeven.unshift(earnings[earnings.length - 1].earnings[i]);
  }
  //console.log(earnings.length - 2);
  if (lastSeven.length < 7 && earnings[earnings.length - 2] !== undefined) {
    for (
      let i = earnings[earnings.length - 2].earnings.length - 1;
      i >= earnings[earnings.length - 1].earnings.length;
      i--
    ) {
      lastSeven.unshift(earnings[earnings.length - 2].earnings[i]);
    }
  }
  //console.warn(lastSeven);
  let displayedEarnings = [0, 0, 0, 0, 0, 0, 0];
  let j = 0;
  currWeek.forEach((day) => {
    lastSeven.forEach((element) => {
      //console.log(day);
      console.log(day);
      if (day === element.date) {
        displayedEarnings[j] = element.amount;
      }
    });
    j++;
  });
  return displayedEarnings;
};
export default calculateEarnings;
