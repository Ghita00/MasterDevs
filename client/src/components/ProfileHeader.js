import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { withSnackbar } from "notistack";
import PropTypes from "prop-types";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import OptionsModal from "./OptionsModal";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";
import ExpandedImageModal from "./ExpandedImageModal";
import Log from "./Log";

class ProfileHeader extends React.Component {
  state = {
    optionsModalIsOpen: false,
    confirmDialogIsOpen: false,
    action: "",
    imageModalIsOpen: false,
    verified: false, /* valore boolean per verificare che l'utente è un adulto */
    manage: false /* valore boolean per verificare che l'utente bambino ha il permesso di gestire il proprio profilo */
  };
  /* funzione che verifica nel database il permesso di modificare le informazioni del profilo */
  getRights = (id) => {
    axios
    .get(`/api/childrenProfile/rights/${id}/getRights`)
    .then((response) => {
      this.setState({ manage: response.data.manage})
    })
    .catch((error) => {
      Log.error(error);
    });
  }
  /* funzione che verifica se l'account è di un adulto */
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

  componentDidMount(){
    const userId = JSON.parse(localStorage.getItem("user")).id
    this.getProfile(userId)
    this.getRights(userId)
  }

  handleImageModalOpen = () => {
    const target = document.querySelector(".ReactModalPortal");
    disableBodyScroll(target);
    this.setState({ imageModalIsOpen: true });
  };

  handleImageModalClose = () => {
    clearAllBodyScrollLocks();
    this.setState({ imageModalIsOpen: false });
  };

  handleClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  handleEdit = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const parentPath = pathname.slice(0, pathname.lastIndexOf("/"));
    const newPath = `${parentPath}/edit`;
    const userId = JSON.parse(localStorage.getItem("user")).id
    if(this.state.verified){ /* questo controllo si accerta che l'utente sia un genitore */
      history.push(newPath);
    } else if(this.state.manage){ /* questo controllo si accerta che l'utente bambino possa modificare le informazioni */
      history.push(`${parentPath}/children/${userId}/edit`);
    } else { //togliere
      alert("non puoi modificare")
    }
  };

  handleOptions = () => {
    const { optionsModalIsOpen } = this.state;
    this.setState({ optionsModalIsOpen: !optionsModalIsOpen });
  };

  handleExport = () => {
    const { match, enqueueSnackbar, language } = this.props;
    const { profileId: userId } = match.params;
    const texts = Texts[language].profileHeader;
    axios
      .post(`/api/users/${userId}/export`)
      .then((response) => {
        enqueueSnackbar(texts.exportSuccess, { variant: "info" });
        Log.info(response);
      })
      .catch((error) => {
        Log.error(error);
      });
  };

  handleDelete = () => {
    const { match, history } = this.props;
    const { profileId: userId } = match.params;
    axios
      .delete(`/api/users/${userId}`)
      .then((response) => {
        Log.info(response);
        if (window.isNative)
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ action: "googleLogout" })
          );
        localStorage.removeItem("user");
        history.push("/");
      })
      .catch((error) => {
        Log.error(error);
      });
  };

  handleSuspend = () => {
    const { match, language, enqueueSnackbar, history } = this.props;
    const { profileId: userId } = match.params;
    const texts = Texts[language].profileHeader;
    axios
      .post(`/api/users/${userId}/suspend`)
      .then((response) => {
        enqueueSnackbar(texts.suspendSuccess, { variant: "info" });
        setTimeout(() => {
          Log.info(response);
          localStorage.removeItem("user");
          history.push("/");
        }, 2000);
      })
      .catch((error) => {
        Log.error(error);
        enqueueSnackbar(texts.error, { variant: "error" });
      });
  };

  handleBackNav = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleConfirmDialogOpen = (action) => {
    this.setState({
      confirmDialogIsOpen: true,
      optionsModalIsOpen: false,
      action,
    });
  };

  handleConfirmDialogClose = (choice) => {
    const { action } = this.state;
    if (choice === "agree") {
      switch (action) {
        case "delete":
          this.handleDelete();
          break;
        case "export":
          this.handleExport();
          break;
        case "suspend":
          this.handleSuspend();
          break;
        default:
      }
    }
    this.setState({ confirmDialogIsOpen: false });
  };

  render() {
    const { language, match, history, photo, name } = this.props;
    const { profileId } = match.params;
    const texts = Texts[language].profileHeader;
    const {
      optionsModalIsOpen,
      confirmDialogIsOpen,
      action,
      imageModalIsOpen,
    } = this.state;
    let confirmDialogTitle;
    switch (action) {
      case "delete":
        confirmDialogTitle = texts.deleteDialogTitle;
        break;
      case "export":
        confirmDialogTitle = texts.exportDialogTitle;
        break;
      case "suspend":
        confirmDialogTitle = texts.suspendDialogTitle;
        break;
      default:
    }
    const options = [
      {
        label: texts.delete,
        style: "optionsModalButton",
        handle: () => {
          this.handleConfirmDialogOpen("delete");
        },
      },
      //? {
      //   label: texts.suspend,
      //   style: "optionsModalButton",
      //   handle: () => {
      //     this.handleConfirmDialogOpen("suspend");
      //   }
      // },
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: () => {
          this.handleConfirmDialogOpen("export");
        },
      },
    ];
    return (
      <div id="profileHeaderContainer">
        <div className="row no-gutters" id="profileHeaderOptions">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() => {if (history.length === 1) {
                                  history.replace("/myfamiliesshare");
                                } else {
                                  history.goBack();
                                }}
              }
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10" />
          {profileId === JSON.parse(localStorage.getItem("user")).id ? (
            <React.Fragment>
              <div className="col-1-10">
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleEdit}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </div>
              <div className="col-1-10">
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleOptions}
                >
                  <i className="fas fa-ellipsis-v" />
                </button>
              </div>
            </React.Fragment>
          ) : (
            <div />
          )}
        </div>
        <img
          className="profilePhoto horizontalCenter"
          alt="user's profile"
          src={photo}
          onClick={this.handleImageModalOpen}
        />
        <h1 className="horizontalCenter">{name}</h1>
        <ExpandedImageModal
          isOpen={imageModalIsOpen}
          handleClose={this.handleImageModalClose}
          image={photo}
        />
        <OptionsModal
          isOpen={optionsModalIsOpen}
          handleClose={this.handleClose}
          options={options}
        />
        <ConfirmDialog
          title={confirmDialogTitle}
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  history: PropTypes.object,
  name: PropTypes.string,
  photo: PropTypes.string,
  language: PropTypes.string,
  match: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

export default withRouter(withLanguage(withSnackbar(ProfileHeader)));
