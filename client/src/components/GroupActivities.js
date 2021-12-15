import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ActivityOptionsModal from "./OptionsModal";
import ActivityListItem from "./ActivityListItem";
import PlanListItem from "./PlanListItem";
import ConfirmDialog from "./ConfirmDialog";
import Log from "./Log";

const styles = {
  add: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
  addPlan: {
    right: "0.5rem",
    height: "4rem",
    width: "4rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
  addActivity: {
    right: "0.5rem",
    height: "4rem",
    width: "4rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
};

const fetchActivites = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/activities`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

const fetchPlans = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/plans`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

class GroupActivities extends React.Component {
  constructor(props) {
    super(props);
    const { group } = this.props;
    this.state = {
      group,
      showAddOptions: false,
      fetchedData: false,
      optionsModalIsOpen: false,
      activity_right: false,
      verified: false
    };
  }

  getRights = (id) => {
    axios
    .get(`/api/childrenProfile/rights/${id}/getRights`)
    .then((response) => {
      this.setState({ activity_right: response.data.activity})
    })
    .catch((error) => {
      Log.error(error);
    });
  }
  
  getProfile = (user_id) => {
    axios
    .get(`/api/users/${user_id}/checkchildren`)
    .then((response) => {
      this.setState({verified: response.data !== null})
    })
    .catch((error) => {
      Log.error(error);
    });
  }

  async componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { group } = this.state;
    const { group_id: groupId } = group;
    const activities = await fetchActivites(groupId);
    const plans = await fetchPlans(groupId);
    const acceptedActivities = activities.filter(
      (activity) => activity.status === "accepted"
    );
    const pendingActivities = activities.length - acceptedActivities.length;
    this.setState({
      confirmDialogIsOpen: false,
      fetchedData: true,
      activities: acceptedActivities,
      pendingActivities,
      plans,
    });
    this.getProfile(userId);
    this.getRights(userId);
  }

  add = (type) => {
    if (this.state.verified || this.state.activity_right){
      const { history } = this.props;
      const {
        group: { group_id: groupId },
      } = this.state;
      const path = `/groups/${groupId}/${type}/create`;
      history.push(path);
    }else {
      alert("non puoi fare attività")
    }

  };

  toggleAdd = () => {
    const { showAddOptions } = this.state;
    this.setState({ showAddOptions: !showAddOptions });
  };

  renderActivities = () => {
    const { group, activities } = this.state;
    const { group_id: groupId } = group;
    return (
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <ActivityListItem activity={activity} groupId={groupId} />
          </li>
        ))}
      </ul>
    );
  };

  renderPlans = () => {
    const { group, plans } = this.state;
    const { group_id: groupId } = group;
    return (
      <ul>
        {plans.map((plan, index) => (
          <li key={index}>
            <PlanListItem plan={plan} groupId={groupId} />
          </li>
        ))}
      </ul>
    );
  };

  handleModalOpen = () => {
    this.setState({ optionsModalIsOpen: true });
  };

  handleModalClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  handleExport = () => {
    const { group } = this.state;
    const { group_id: groupId } = group;
    this.setState({ optionsModalIsOpen: false });
    axios
      .post(`/api/groups/${groupId}/agenda/export`)
      .then((response) => {
        Log.info(response);
      })
      .catch((error) => {
        Log.error(error);
      });
  };

  handlePendingRequests = () => {
    const { history } = this.props;
    const { group } = this.state;
    const { group_id: groupId } = group;
    history.push(`/groups/${groupId}/activities/pending`);
  };

  handleConfirmDialogOpen = () => {
    this.setState({ confirmDialogIsOpen: true, optionsModalIsOpen: false });
  };

  handleConfirmDialogClose = (choice) => {
    if (choice === "agree") {
      this.handleExport();
    }
    this.setState({ confirmDialogIsOpen: false });
  };

  render() {
    const { classes, language, history, userIsAdmin } = this.props;
    const {
      optionsModalIsOpen,
      confirmDialogIsOpen,
      group,
      pendingActivities,
      showAddOptions,
      fetchedData,
      plans,
    } = this.state;
    const { name } = group;
    const texts = Texts[language].groupActivities;
    const options = [
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: this.handleConfirmDialogOpen,
      },
    ];
    return (
      <div style={{ paddingBottom: "6rem" }}>
        <ActivityOptionsModal
          isOpen={optionsModalIsOpen}
          options={options}
          handleClose={this.handleModalClose}
        />
        <ConfirmDialog
          title={texts.exportConfirm}
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <div className="row no-gutters" id="groupMembersHeaderContainer">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10 ">
            <h1 className="verticalCenter">{name}</h1>
          </div>
          <div className="col-1-10 ">
            {userIsAdmin && (
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handlePendingRequests}
              >
                <i className="fas fa-certificate">
                  {pendingActivities > 0 && (
                    <span className="activities-badge">
                      {pendingActivities}
                    </span>
                  )}
                </i>
              </button>
            )}
          </div>
          <div className="col-1-10 ">
            <button
              type="button"
              className="transparentButton center"
              onClick={this.handleModalOpen}
            >
              <i className="fas fa-ellipsis-v" />
            </button>
          </div>
        </div>
        <div
          className="row no-gutters"
          style={{
            bottom: "8rem",
            right: "7%",
            zIndex: 100,
            position: "fixed",
          }}
        >
        {this.state.activity_right &&(  
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.add}
            onClick={() =>
              userIsAdmin ? this.toggleAdd() : this.add("activities")
            }
          >
            <i className={showAddOptions ? "fas fa-times" : "fas fa-plus"} />
          </Fab>
        )}
        </div>
        {showAddOptions && (
          <React.Fragment>
            <div
              className="row no-gutters"
              style={{
                bottom: "14rem",
                right: "7%",
                zIndex: 100,
                position: "fixed",
                alignItems: "center",
              }}
            >
              <div className=" activitiesFabLabel">{texts.newActivity}</div>
              <Fab
                color="primary"
                aria-label="addActivity"
                className={classes.addActivity}
                onClick={() => this.add("activities")}
              >
                <i className="fas fa-certificate" />
              </Fab>
            </div>
            <div
              className="row no-gutters"
              style={{
                bottom: "20rem",
                zIndex: 100,
                position: "fixed",
                right: "7%",
                alignItems: "center",
              }}
            >
              <div className=" activitiesFabLabel">{texts.newPlan}</div>
              <Fab
                color="primary"
                aria-label="addPlan"
                className={classes.addPlan}
                onClick={() => this.add("plans")}
              >
                <i className="fas fa-calendar" />
              </Fab>
            </div>
          </React.Fragment>
        )}
        <div style={{ paddingBottom: "6rem" }}>
          {fetchedData && (
            <div id="groupActivitiesContainer" className="horizontalCenter">
              <h1 className="">{texts.activitiesHeader}</h1>
              {this.renderActivities()}
            </div>
          )}
          {fetchedData && plans.length > 0 && (
            <div id="groupActivitiesContainer" className="horizontalCenter">
              <h1 className="">{texts.plansHeader}</h1>
              {this.renderPlans()}
            </div>
          )}
        </div>
      </div>
    );
  }
}

GroupActivities.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  classes: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withStyles(styles)(withLanguage(GroupActivities));
