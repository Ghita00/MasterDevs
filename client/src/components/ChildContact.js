import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import * as path from "lodash.get";
import Avatar from "./Avatar";
import axios from "axios";

class ChildContact extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      verified: false
    }
  }
  getChildProfile = (groupId, childId) => {
    axios
        .get(`/api/users/MemberChildUser/${groupId}/${childId}`)
        .then((response) => {
          const found = response.data;
          this.setState({verified: found !== undefined})

        })
        .catch((error) => {
          return true;
        });
    
  }
  componentDidMount(){
    const { member: profile } = this.props;
    this.getChildProfile(this.props.groupId,profile.child_id)
  }
  handleRedirect = (suspended, child_id) => {
    const { history } = this.props;
    if (!suspended) {
      history.push(`/profiles/groupmember/children/${child_id}`);
    }
  };
  
  

  render() {
    const { member: profile } = this.props;
    return (
      <div id="contactContainer" className="row no-gutters">
        <div className="col-2-10">
          <Avatar
            thumbnail={path(profile, ["image", "path"])}
            route={`/profiles/groupmember/children/${profile.child_id}`}
            disabled={profile.suspended}
          />
        </div>
        <div className="col-5-10">
          <div
            role="button"
            tabIndex={-42}
            id="contactInfoContainer"
            className="center"
            onClick={() =>
              this.handleRedirect(profile.suspended, profile.child_id)
            }
          >
            <h1>{`${profile.given_name} ${profile.family_name}`}</h1>
            
            {(this.state.verified)&&
            (<p>bambino_utente</p>)}
            
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ChildContact);

ChildContact.propTypes = {
  member: PropTypes.object,
  history: PropTypes.object,
};
