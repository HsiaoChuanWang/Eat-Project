import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId:
    "909607454836-boa84n78us1681mua5ho7sln81ctgrkr.apps.googleusercontent.com",
  apiKey: "AIzaSyAWA1dLV3FvpY1XvYVJHnLHxJe3GTKgVEg",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};
const apiCalendar = new ApiCalendar(config);

function handleAddCalendarClick() {
  console.log("add");
  apiCalendar
    .createEvent({
      summary: "My Testing",
      start: {
        dateTime: "2023-11-19T14:30:00+08:00",
      },
      end: {
        dateTime: "2023-11-19T15:30:00+08:00",
      },
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

function Calendar() {
  return (
    <>
      <button onClick={handleAddCalendarClick}>add calendar</button>
    </>
  );
}

export default Calendar;
