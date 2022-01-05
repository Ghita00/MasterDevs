import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Skeleton } from "antd";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import Avatar from "./Avatar";
import Log from "./Log";

/* trova i gruppi in cui è l'utente  */
const getGroup = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {
        image: { path: "" },
        group_id: "",
        name: "",
      };
    });
};
/* trova i membri all'interno di un gruppo */
const getGroupMembers = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/members`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

class ChooseGroupItem extends React.Component {
  state = { fetchedGroupData: false, group: {} };

  async componentDidMount() {
    const { groupId } = this.props;
    const group = await getGroup(groupId); /* prende il gruppo dal database e ne mostra il nome ed il logo */
    const members = await getGroupMembers(groupId); /* prende i membri effettivi del gruppo (genitori + ragazzi utenti) e ne mostra il numero*/
    group.members = members.filter(
      (member) => member.user_accepted && member.group_accepted
    );
    this.setState({ fetchedGroupData: true, group });
  }
 /* TODO */
  handleNavigation = () => {
    const { history } = this.props;
    const { group } = this.state;
    history.push(`/groups/${group.group_id}/activities`);
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].groupListItem;
    const { group, fetchedGroupData } = this.state;
    return fetchedGroupData ? (
      <div
        role="button"
        tabIndex={-42}
        className="row no-gutters"
        id="suggestionContainer"
      >
        <div className="col-2-10">
          <Avatar
            thumbnail={group.image.thumbnail_path}
            className="center"
            route={`/groups/${group.group_id}/activities`}
          />
        </div>
        <div className="col-8-10">
          <div id="suggestionInfoContainer">
            <h1>{group.name}</h1>
            <h2>{`${texts.members}: ${group.members.length}`}</h2>
          </div>
        </div>
      </div>
    ) : (
      <div className="row no-gutters" id="suggestionContainer">
        <Skeleton avatar active paragraph={{ rows: 2 }} />
      </div>
    );
  }
}

ChooseGroupItem.propTypes = {
  groupId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(withLanguage(ChooseGroupItem));
