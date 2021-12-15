import React from "react";
import PropTypes from "prop-types";
import { Skeleton } from "antd";
import moment from "moment";
import { withRouter } from "react-router-dom";
import * as path from "lodash.get";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import Log from "./Log";
import axios from "axios";

class ParentListItem extends React.Component {
  state = { fetchedParent: false, parent: {}};

  componentDidMount() {
    const { Id } = this.props.Id;
    axios
      .get(`/api/users/${Id}`)
      .then((response) => {
        const parent = response.data;
        this.setState({ fetchedParent: true, parent});
      })
      .catch((error) => {
        Log.error(error);
      });
  }

  render() {
    const { language, history } = this.props;
    const { pathname } = history.location;
    const { parent, fetchedParent } = this.state;
    const route = `${pathname}/${parent.user_id}`;
    return (
      <div
        id="parentContainer"
        className="row no-gutters"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.1" }}
      >
        {fetchedParent ? (
          <React.Fragment>
            <div className="col-3-10">
              <Avatar
                thumbnail={path(parent, ["image", "path"])}
                route={route}
                className="center"
              />
            </div>
            <div className="col-7-10">
              <div
                role="button"
                tabIndex={-42}
                onClick={() => history.push({
                  pathname: route,
                })}
                id="parentInfoContainer"
                className="verticalCenter"
              >
                <h1>{`${parent.given_name} ${parent.family_name}`}</h1>
                <h1>
                  {`${moment().diff(parent.birthdate, "years")}`}
                </h1>
              </div>
            </div>
            
            
          </React.Fragment>
        ) : (
          <Skeleton avatar active paragraph={{ rows: 1 }} />
        )}
      </div>
    );
  }
}

export default withRouter(withLanguage(ParentListItem));

ParentListItem.propTypes = {
  Id: PropTypes.string,
  userId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object,
};
