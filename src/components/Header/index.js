import { MdOutlineLogout } from "react-icons/md";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="header-bg-container">
      <h1 className="header-heading">Fresite</h1>
      <Popup
        modal
        trigger={
          <button className="header-logout-btn" type="button">
            Logout
          </button>
        }
      >
        {(close) => (
          <div className="logout-popup-cont">
            <p className="logout-popup-text">
              Are you sure you want to log out?
            </p>
            <div className="logout-popup-btn-cont">
              <button className="logout-popup-cancel-btn" onClick={close}>
                Cancel
              </button>
              <button
                className="logout-popup-confirm-btn"
                onClick={() => {
                  navigate("/login");
                  Cookies.remove("access_Token");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </Popup>
      <Popup modal trigger={<MdOutlineLogout className="header-logout-icon" />}>
        {(close) => (
          <div className="logout-popup-cont">
            <p className="logout-popup-text">
              Are you sure you want to log out?
            </p>
            <div className="logout-popup-btn-cont">
              <button className="logout-popup-cancel-btn" onClick={close}>
                Cancel
              </button>
              <button
                className="logout-popup-confirm-btn"
                onClick={() => {
                  navigate("/login");
                  Cookies.remove("access_Token");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default Header;
