import "./Profile.css";
import { Mail, FolderPen, IdCardLanyard, UserKey } from "lucide-react";
import { getUser } from "../../auth/getUser";

export default function Profile() {
  const user = getUser();
  const formatInit = (fullName?: string): string => {
    if (!fullName) return "Guest";

    return fullName
      .split(" ")
      .map((p) => p.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <div className="bg-[#F0E8ED] w-full p-[25px]">
      {/*The whole card with the rounded corners*/}
      <div className="profile-div">
        {/*The gradient part*/}
        <div className="top-profile-div">
          {/*The profile icon*/}
          <div className="profile-img">
            <h1>{formatInit(user?.fullName)}</h1>
          </div>
          {/*The name below the profile icon*/}
          <h2>EMPLOYEE PROFILE</h2>
        </div>
        {/*The whole part below the gradient*/}
        <div className="bottom-profile-div">
          <h1 className="profile-name">{user?.fullName}</h1>
          <hr className="hr"/>
          {/*Table*/}
          <table className="profile-table">
            <tbody>
              <tr className="bottom-border">
                <td className="right-border">
                  <div>
                    <h2>EMAIL ADDRESS</h2>
                    <div className="icon-text">
                      <Mail /> <p>{user?.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <h2>FULL NAME</h2>
                    <div className="icon-text">
                      <FolderPen /> <p>{user?.fullName}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="right-border">
                  <div>
                    <h2>STAFF ID</h2>
                    <div className="icon-text">
                      <IdCardLanyard /> <p>{user?.staffID}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <h2>ROLE</h2>
                    <div className="icon-text">
                      <UserKey /> <p>{user?.role}</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
