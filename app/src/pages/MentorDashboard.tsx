import React, { useState } from "react";
import Navbar from "../components/Navbar";


const MentorDashboard = () => {

  return (
    <>
      <Navbar />
      <div className="Flex-row Justify-content--spaceBetween">
        <div className="Block Width--60 Margin-right--40 Margin-left--40 Margin-top--40 Height--100vh">

        <div className="Flex-row Margin-bottom--30">
          <div className="Button--large Border-color--light-1000 Text-color--gray-600 Margin-right--40">My Mentees</div>
          <div className="Button--large Border-color--light-1000 Text-color--gray-600">Courses</div>
        </div>

          <div className="Flex-grid Justify-content--spaceBetween Margin-bottom--40">
            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--teal-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}></div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">JaneDoe</h3>
              </div>
            </div>

            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--green-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}></div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">Jane Doe</h3>
              </div>
            </div>

            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--blue-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}></div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">Jane Doe</h3>
              </div>
            </div>
          </div>

        </div>
        <div className="Block Width--40 Margin-right--40 Margin-top--40 Height--100vh">
          <div className="Block-header Text--center Text-color--gray-1000 Margin-bottom--20">Upcoming Events!</div>  
        </div> 

      </div>
    </>
  );
};

export default MentorDashboard;
