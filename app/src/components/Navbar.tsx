import react, { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = (): ReactElement => {
  const navigate = useNavigate();
  return (
    <>
      <div className="Navbar">
        <div className="Navbar-body">
          <div
            onClick={() => {
              navigate("/home");
            }}
            className="Navbar-body-logo"
          ></div>
          <div className="Flex-row Margin-left--auto">
            <div
<<<<<<< HEAD
              //className="Navbar-body-link Margin-right--20"
=======
              // className="Navbar-body-link Margin-right--20"
>>>>>>> 95b86b1204320b9b921bba8d9bc4c56c24148501
              onClick={() => {
                navigate("/home");
              }}
              className="Navbar-body-home"
            ></div>
            <div
              className="Navbar-body-link"
              onClick={() => {
                navigate("/mentor");
              }}
            >
              Mentor
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/mentee")
              }}
            >
              Mentee
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/create-workshop")
              }}
            >
              Create Workshop
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/create-meeting");
              }}
            >
              Create Meeting
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
