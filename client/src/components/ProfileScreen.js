import React from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import Loadable from "react-loadable";
import PropTypes from "prop-types";
import * as path from "lodash.get";
import ProfileHeader from "./ProfileHeader";
import ProfileNavbar from "./ProfileNavbar";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

const ProfileInfo = Loadable({
  loader: () => import("./ProfileInfo"),
  loading: () => <div />,
});
const ProfileChildren = Loadable({
  loader: () => import("./ProfileChildren"),
  loading: () => <div />,
});
/*const ProfileParents = Loadable({
  loader: () => import("./ProfileParents"),
  loading: () => <div />,
});*/

const getMyChildren = async (userId) => {
  return axios
    .get(`/api/users/${userId}/children`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

/*const getMyParents = (userId) => {
  return axios
    .get(`/api/users/${userId}/parents`) 
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

const getMyParents = async (userId, childId) => {
  try {
    const response = await axios
      .get(`/api/users/${userId}/childUser/${childId}/parents`);
    return response.data;
  } catch (error) {
    Log.error(error);
    return [];
  }
};*/

const getMyProfile = async (userId) => {
  return axios
    .get(`/api/users/${userId}/profile`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {
        given_name: "",
        family_name: "",
        image: { path: "/images/profiles/user_default_photo.png" },
        address: { street: "", number: "" },
        email: "",
        phone: "",
        phone_type: "",
        visible: false,
        user_id: "",
      };
    });
};


class ProfileScreen extends React.Component {
  state = {
    profile: {},
    relatives: [],
    fetchedProfile: false,
    isParent: false 
  };

  getProfile = async (userId) => {
    axios
    .get(`/api/users/${userId}/checkchildren`)
    .then((response) => {
      this.setState({isParent: response.data !== null})
    })
    .catch((error) => {
      Log.error(error);
    });
  }

  async componentDidMount() {
    const { match } = this.props;
    const { profileId } = match.params;
    const profile = await getMyProfile(profileId);

    await this.getProfile(JSON.parse(localStorage.getItem("user")).id);

    console.log(this.state.isParent);

    //if (true) {  // da fixare 
      const relatives = await getMyChildren(profileId);  
      this.setState({
        fetchedProfile: true,
        relatives,
        profile,
      });
    /*} else {
      const relatives = await getMyParents(profileId);
      this.setState({
        fetchedProfile: true,
        relatives,
        profile,
      },()=> {console.log(relatives);});
    }*/
  }
  

  render() {
    const { match } = this.props;
    const { profileId } = match.params;
    const { fetchedProfile, relatives } = this.state;
    const currentPath = match.url;
    const { profile } = this.state;

    console.log(relatives);


    return fetchedProfile ? (
      <React.Fragment>
        <ProfileHeader
          name={`${profile.given_name} ${profile.family_name}`}
          photo={path(profile, ["image", "path"])}
        />
        <React.Fragment>
          <ProfileNavbar /*isParent={this.state.isParent}*//>
          <Switch>
            <Route
              exact
              path={`${currentPath}/info`}
              render={(props) => <ProfileInfo {...props} profile={profile} />}
            />
            {//this.state.isParent ? (
            <Route
              exact
              path={`${currentPath}/children`}
              render={(props) => (
                <ProfileChildren
                  {...props}
                  profileId={profileId}
                  usersChildren={relatives}
                />
              )}
            /> /*) : (
            <Route
              
              path={`${currentPath}/parents`}
              render={(props) => (
                <ProfileParents
                  {...props}
                  profileId={profileId}
                  usersParents={relatives}
                />
              )}
            />
            )*/}
          </Switch>
        </React.Fragment>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}


ProfileScreen.propTypes = {
  match: PropTypes.object,
};

export default ProfileScreen;
