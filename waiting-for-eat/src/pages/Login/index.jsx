import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId: import.meta.env.VITE_GOOGLE_CALENDAR,
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};
const apiCalendar = new ApiCalendar(config);

function Login() {
  function handleItemClick(e, name) {
    console.log(apiCalendar);
    if (name === "sign-in") {
      apiCalendar.handleAuthClick();
    } else if (name === "sign-out") {
      apiCalendar.handleSignoutClick();
    }
    console.log(apiCalendar);
  }
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
  return (
    <div className="App">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CALENDAR}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
      <button
        onClick={(e) => {
          handleItemClick(e, "sign-in");
        }}
      >
        sign-in
      </button>
      <button
        onClick={(e) => {
          handleItemClick(e, "sign-out");
        }}
      >
        sign-out
      </button>
      <button onClick={handleAddCalendarClick}>add calendar</button>
    </div>
  );
}

export default Login;
