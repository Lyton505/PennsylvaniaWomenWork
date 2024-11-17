import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Jane from "../assets/jane.jpg";
import John from "../assets/john.jpg";
import Jess from "../assets/jess.jpg";


const MentorDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="Flex-row Justify-content--spaceBetween">
        <div className="Block Width--60 Margin-right--40 Margin-left--40 Margin-top--40 Height--100vh">

        <div className="Flex-row">
          <div className="Block-header Text-color--gray-600 Margin-right--40">My Mentees</div>
          <div className="Block-header Text-color--gray-600">Courses</div>
        </div>

          <div className="Flex-row Justify-content--spaceBetween">
            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--teal-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={Jane} 
                    alt="Jane Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">Jane Doe</h3>
              </div>
            </div>

            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--green-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={Jane} 
                    alt="Jane Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">Jane Doe</h3>
              </div>
            </div>

            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--blue-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={Jane} 
                    alt="Jane Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">Jane Doe</h3>
              </div>
            </div>

          </div>



          <div className="Flex-row Justify-content--spaceBetween">
            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--green-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={John} 
                    alt="John Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">John Doe</h3>
              </div>
            </div>

            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--blue-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={John} 
                    alt="John Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">John Doe</h3>
              </div>
            </div>

            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--teal-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={John} 
                    alt="John Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">John Doe</h3>
              </div>
            </div>

          </div>


          <div className="Flex-row Justify-content--spaceBetween">
            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--blue-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={Jess} 
                    alt="Jess Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">Jess Doe</h3>
              </div>
            </div>

            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--teal-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={Jess} 
                    alt="Jess Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">Jess Doe</h3>
              </div>
            </div>

            <div className="Card Card--noPadding Card-hover Margin-right--10" style={{ width: "215px"}}>
              <div className="Background-color--green-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center" style={{ height: "96px" }}>
                  <img 
                    src={Jess} 
                    alt="Jess Doe"
                    className="Image Border--rounded"
                  />
              </div>
              <div className="Padding--10" style={{ height: "75px" }}>
                <h3 className="Text-fontSize--20 Text-color--gray-600">Jess Doe</h3>
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
