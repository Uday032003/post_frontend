import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import io from "socket.io-client";
import { RingLoader } from "react-spinners";
import Cookies from "js-cookie";

import "./index.css";

const socket = io.connect("https://post-backkend.onrender.com", {
  transports: ["websocket", "polling"],
});

const Login = () => {
  const navigate = useNavigate();
  const [inpText, changeInpText] = useState("");
  const [inpOtp, changeInpOtp] = useState("");
  const [inpName, changeInpName] = useState("");
  const [inpUsername, changeInpUsername] = useState("");
  const [inpEmail, changeInpEmail] = useState("");
  const [view, setView] = useState("login");
  const [userStatus, setUserStatus] = useState("Unregistered");
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [getOtpBtnClicked, setGetOtpBtnClicked] = useState(false);
  const [getVerifyBtnClicked, setGetVerifyBtnClicked] = useState(false);
  const [getSignupBtnClicked, setGetSignupBtnClicked] = useState(false);
  const [otpVerificationErrorMsg, setOtpVerificationErrorMsg] = useState("");
  const [signUpErrorMsg, setSignUpErrorMsg] = useState("");

  useEffect(() => {
    socket.on("otp_generated", (data) => {
      setOtpGenerated(data);
    });
  });

  const userCheckin = async () => {
    const url = "https://post-backkend.onrender.com/login/";
    const userData = { usernameOrMail: inpText };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          setView("otp");
        }, 1000);
        if (data.msg !== "User not found") {
          setUserStatus("Registered");
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const userSignUp = async () => {
    const url = "https://post-backkend.onrender.com/users/";
    const userData = { username: inpUsername, name: inpName, email: inpEmail };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    if (inpText === inpEmail) {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (response.ok) {
          if (data.msg === "Username already exists") {
            setSignUpErrorMsg("*" + data.msg);
          } else {
            setGetSignupBtnClicked(true);
            setTimeout(() => {
              Cookies.set(
                "access_Token",
                "a38bcd2efghi6jk5lmn9opqr7stu1vwxy4z",
                { expires: 30 }
              );
              navigate("/");
            }, 1000);
          }
        } else {
          setSignUpErrorMsg("*" + data.msg);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      setSignUpErrorMsg("*Email Mismatched");
    }
  };

  const Loader = () => <RingLoader color="#aca5a5ff" size={10} />;

  const loginFormSubmitted = (event) => {
    event.preventDefault();
    if (inpText.length !== 0) {
      userCheckin();
      socket.emit("entered_mail", inpText);
      setGetOtpBtnClicked(true);
    } else {
      setLoginErrorMsg("*Cannot be empty");
    }
  };

  const otpFormSubmitted = (event) => {
    event.preventDefault();
    if (otpGenerated === inpOtp) {
      setGetVerifyBtnClicked(true);
      if (userStatus === "Unregistered") {
        setTimeout(() => {
          setView("registration");
        }, 1000);
      } else {
        localStorage.setItem("email", inpText);
        setTimeout(() => {
          Cookies.set("access_Token", "a38bcd2efghi6jk5lmn9opqr7stu1vwxy4z", {
            expires: 30,
          });
          navigate("/");
        }, 1000);
      }
    } else {
      setOtpVerificationErrorMsg("Invalid OTP");
    }
  };

  const signupFormSubmitted = (event) => {
    event.preventDefault();
    userSignUp();
  };

  const refreshCode = () => {
    socket.emit("entered_mail", inpText);
  }

  const LoginView = () => (
    <form onSubmit={loginFormSubmitted} className="login-inner-form-container">
      <p className="login-sigup">Login / Sign Up</p>
      <div className="login-label-inp-cont">
        <label htmlFor="login-inpp">Email:</label>
        <input
          type="email"
          placeholder="Email"
          className="login-inp"
          id="login-inpp"
          value={inpText}
          onChange={(event) => {
            changeInpText(event.target.value);
            setLoginErrorMsg("");
          }}
        />
        <p className="login-error-msg">{loginErrorMsg}</p>
      </div>
      <div className="login-btn-loader-cont">
        <button
          type="submit"
          className={`login-getotp-btn ${
            getOtpBtnClicked && "get-otp-btn-clicled"
          }`}
        >
          Get Code
        </button>
        {getOtpBtnClicked && loginErrorMsg === "" && <Loader />}
      </div>
    </form>
  );

  const OtpView = () => (
    <form onSubmit={otpFormSubmitted} className="login-inner-form-container">
      <p className="login-sigup">
        {userStatus === "Registered" ? "Login" : "Sign Up"}
      </p>
      <div className="login-label-inp-cont">
        <p className="login-otp-content">
          Enter the code {otpGenerated} to login / sign up.
        </p>
        <label htmlFor="login-inppp">Code:</label>
        <input
          type="text"
          placeholder="Enter Code"
          className="login-inp"
          id="login-inppp"
          value={inpOtp}
          onChange={(event) => {
            changeInpOtp(event.target.value);
            setOtpVerificationErrorMsg("");
          }}
        />
        <p className="login-error-msg">{otpVerificationErrorMsg}</p>
        <button type="button" className="login-resend-btn" onClick={refreshCode}>
          Refresh Code
        </button>
      </div>
      <div className="login-btn-loader-cont">
        <button
          type="submit"
          className={`login-getotp-btn ${
            getVerifyBtnClicked && "get-otp-btn-clicled"
          }`}
        >
          {userStatus === "Registered" ? "Verify & Login" : "Verify & Sign Up"}
        </button>
        {getVerifyBtnClicked && otpVerificationErrorMsg === "" && <Loader />}
      </div>
    </form>
  );

  const RegisterView = () => (
    <form onSubmit={signupFormSubmitted} className="login-inner-form-container">
      <p className="login-sigup">Sign Up</p>
      <div className="login-register-label-inp-cont">
        <label htmlFor="login-innpp">Name:</label>
        <input
          type="text"
          placeholder="Enter Name"
          className="login-inp"
          id="login-innpp"
          value={inpName}
          onChange={(event) => changeInpName(event.target.value)}
        />
      </div>
      <div className="login-register-label-inp-cont">
        <label htmlFor="login-iinpp">Username:</label>
        <input
          type="text"
          placeholder="Username"
          className="login-inp"
          id="login-iinpp"
          value={inpUsername}
          onChange={(event) => {
            changeInpUsername(event.target.value);
            setSignUpErrorMsg("");
          }}
        />
      </div>
      <div className="login-register-label-inp-cont">
        <label htmlFor="login-iinnpp">Email:</label>
        <input
          type="text"
          placeholder="Email"
          className="login-inp"
          id="login-iinnpp"
          value={inpEmail}
          onChange={(event) => {
            changeInpEmail(event.target.value);
            setSignUpErrorMsg("");
          }}
        />
      </div>
      <p className="login-register-error-msg">{signUpErrorMsg}</p>
      <div className="login-btn-loader-cont">
        <button
          type="submit"
          className={`login-signup-btn ${
            getSignupBtnClicked && "get-otp-btn-clicled"
          }`}
        >
          Sign Up
        </button>
        {getSignupBtnClicked && loginErrorMsg === "" && <Loader />}
      </div>
    </form>
  );

  const renderView = () => {
    switch (view) {
      case "login":
        return LoginView();
      case "otp":
        return OtpView();
      case "registration":
        return RegisterView();
      default:
        return null;
    }
  };

  const accessToken = Cookies.get("access_Token");
  if (accessToken !== undefined) {
    return <Navigate to="/" />;
  }
  return (
    <div className="login-bg-container">
      <h1 className="login-heading">Fresite</h1>
      {renderView()}
    </div>
  );
};

export default Login;
