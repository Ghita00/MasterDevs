import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import moment from "moment";
import { withRouter } from "react-router-dom";
import * as path from "lodash.get";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import Log from "./Log";
import Images from "../Constants/Images";

class ChildListItem extends React.Component {
  /*verified: variabile utitlizzata per la verifica di un utente bambino*/ 
  state = { fetchedChild: false, child: {}, verified: false};

  componentDidMount() {
    const { userId, childId} = this.props;
    
    axios
      .get(`/api/users/${userId}/children/${childId}`)
      .then((response) => {
        const child = response.data;
        this.setState({ fetchedChild: true, child});
      })
      .catch((error) => {
        Log.error(error);
        this.setState({
          fetchedChild: true,
          child: {
            image: { path: "" },
            birthdate: new Date(),
            gender: "unspecified",
            given_name: "",
            family_name: "",
            child_id: "",
          }
        });
      });
    /* chiamata al database per trovare i bambini utenti */
    axios
      .get(`/api/users/${userId}/childUser/${childId}`)
      .then((response) => {
        this.setState({ verified: response.data.child_id !== null});
      })
      .catch((error) => {
        Log.error(error);
      });
  }

  render() {
    const { userId, language, history, childId } = this.props;
    const { pathname } = history.location;
    const { child, fetchedChild, verified } = this.state;
    const texts = Texts[language].childListItem;
    const route = `${pathname}/${childId}`;
    return (
      <div
        id="childContainer"
        className="row no-gutters"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.1" }}
      >
        {fetchedChild ? (
          <React.Fragment>
            <div className="col-3-10">
              <Avatar
                thumbnail={path(child, ["image", "path"])}
                route={route}
                className="center"
              />
            </div>
            <div className="col-3-10">
              <div
                role="button"
                tabIndex={-42}
                onClick={() => history.push({
                  pathname: route,
                  verified: verified
                })}
                id="childInfoContainer"
                className="verticalCenter"
              >
                <h1>{`${child.given_name} ${child.family_name}`}</h1>
                <h1>
                  {`${moment().diff(child.birthdate, "years")} ${texts.age}`}
                </h1>
                
                <h2>{texts[child.gender] === undefined ? "Bambin*" : texts[child.gender] }</h2>
              </div>
            </div>
            <div className="col-2-10">
              {this.state.verified &&
                ( 
                  <img onClick={function() {
                      history.push({
                        pathname: route+'/groups',
                        user_id: userId,
                        child_id: childId
                      })
                    }} 
                    
                    src={/*cambia icona*/ Images.couple} 
                    width={'60'} 
                    height={'60'}  
                    align="right" 
                    vertical-align="middle"             
                    alt="birthday icon"/>
                )
              } 
              <div>
                {/*TODO cambia icona*/ }
                {!this.state.verified &&
                (
                  <img 
                    src={Images.babyFace} 
                    width={'60'} 
                    height={'60'} 
                    align="right" 
                    vertical-align="middle" 
                    alt="conversion button"
                        onClick={() => history.push({
                          pathname: `/profiles/${userId}/children/create/profile`,
                          info: [
                            child.file,
                            child.image,
                            child.given_name,
                            child.family_name,
                            child.gender,
                            child.background,
                            child.other_info,
                            child.special_needs,
                            child.allergies,
                            child.birthdate,
                            childId
                          ]
                        })}
                  />
                )
              } 
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

export default withRouter(withLanguage(ChildListItem));

ChildListItem.propTypes = {
  childId: PropTypes.string,
  userId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object,
};
