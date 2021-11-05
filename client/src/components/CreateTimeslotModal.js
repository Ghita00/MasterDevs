import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import autosize from "autosize";
import { Select, MenuItem } from "@material-ui/core";
import {
  MenuBook,
  EmojiNature,
  Museum,
  SportsBaseball,
  Commute,
  Mood,
  Cake,
  Event,
  ChildCare,
} from "@material-ui/icons";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import Images from "../Constants/Images";

Modal.setAppElement("#root");

class CreateTimeslotModal extends React.Component {
  constructor(props) {
    super(props);
    const { data, expanded } = this.props;
    this.state = {
      ...data,
      formIsValidated: false,
      expanded,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.expanded !== prevState.expanded) {
      return {
        expanded: nextProps.expanded,
        ...nextProps.data,
      };
    }
    return null;
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validate()) {
      this.handleSave();
    } else {
      this.setState({ formIsValidated: true });
    }
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].expandedTimeslotEdit;
    const formLength = this.formEl.length;
    const { startTime, endTime } = this.state;
    const samePeriod =
      Math.floor(startTime.substr(0, startTime.indexOf(":")) / 12) ===
      Math.floor(endTime.substr(0, endTime.indexOf(":")) / 12);
    const invalidTime = samePeriod && startTime >= endTime;
    if (this.formEl.checkValidity() === false || invalidTime) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i];
        if (elem.name === "startTime" || elem.name === "endTime") {
          if (invalidTime) {
            elem.setCustomValidity(texts.timeError);
          } else {
            elem.setCustomValidity("");
          }
        }
        if (elem.nodeName.toLowerCase() !== "button") {
          const errorLabel = document.getElementById(`${elem.name}Err`);
          if (errorLabel) {
            if (!elem.validity.valid) {
              if (elem.validity.valueMissing) {
                errorLabel.textContent = texts.requiredErr;
              } else if (elem.validity.customError) {
                errorLabel.textContent = texts.timeErr;
              } else if (elem.validity.rangeUnderflow) {
                errorLabel.textContent = texts.rangeErr;
              }
              errorLabel.style.display = "block";
            } else {
              errorLabel.textContent = "";
              errorLabel.style.display = "none";
            }
          }
        }
      }
      return false;
    }
    for (let i = 0; i < formLength; i += 1) {
      const elem = this.formEl[i];
      const errorLabel = document.getElementById(`${elem.name}Err`);
      if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
        errorLabel.textContent = "";
        errorLabel.style.display = "block";
      }
    }

    return true;
  };

  closeModal = () => {
    const { handleClose } = this.props;
    this.setState({ formIsValidated: false });
    handleClose();
  };

  afterOpenModal = () => {};

  handleSave = () => {
    const {
      startTime,
      endTime,
      requiredChildren,
      requiredParents,
      description,
      name,
      location,
      category,
      cost,
      link,
    } = this.state;
    const timeslot = {
      startTime,
      endTime,
      requiredChildren,
      requiredParents,
      description,
      name,
      cost,
      location,
      category,
      link,
    };
    const { handleSave } = this.props;
    handleSave(timeslot);
    this.setState({ formIsValidated: false });
  };

  render() {
    const {
      formIsValidated,
      category,
      expanded,
      startTime,
      endTime,
      name,
      description,
      location,
      requiredChildren,
      requiredParents,
      cost,
      link,
    } = this.state;
    const { language } = this.props;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    const rowStyle = { margin: "2rem 0" };
    const texts = Texts[language].expandedTimeslotEdit;
    const modalStyle = {
      overlay: {
        zIndex: 10,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      },
      content: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        backgroundColor: "#ffffff",
        maxWidth: "40rem",
        maxHeight: "65rem",
        width: "90%",
        height: "90%",
      },
    };
    return (
      <Modal
        style={modalStyle}
        isOpen={expanded}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Create Timeslot Modal"
      >
        {" "}
        <div>
          <div className="row no-gutters" id="expandedTimeslotHeaderContainer">
            <div className="col-8-10">
              <h1 className="verticalCenter">{texts.details}</h1>
            </div>
            <div className="col-1-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.closeModal}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="col-1-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleSubmit}
              >
                <i className="fas fa-check" />
              </button>
            </div>
          </div>
          <div id="expandedTimeslotMainContainer">
            <form
              ref={(form) => {
                this.formEl = form;
              }}
              onSubmit={this.handleSubmit}
              className={formClass}
              noValidate
            >
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-clock center" />
                </div>
                <div className="col-2-10">
                  <h4 className="verticalCenter">{texts.from}</h4>
                </div>
                <div className="col-6-10">
                  <input
                    name="startTime"
                    type="time"
                    value={startTime}
                    onChange={this.handleChange}
                    className="expandedTimeslotTimeInput"
                  />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10" />
                <div className="col-2-10">
                  <h4 className="verticalCenter">{texts.to}</h4>
                </div>
                <div className="col-6-10">
                  <input
                    name="endTime"
                    type="time"
                    value={endTime}
                    onChange={this.handleChange}
                    className="expandedTimeslotTimeInput form-control"
                  />
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-2-10" />
                <div className="col-8-10">
                  <span className="invalid-feedback" id="endTimeErr" />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-clipboard-check center" />
                </div>
                <div className="col-8-10">
                  <input
                    type="text"
                    name="name"
                    value={name}
                    className="expandedTimeslotInput form-control"
                    onChange={this.handleChange}
                    placeholder={texts.name}
                    required
                  />
                  <span className="invalid-feedback" id="nameErr" />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-map-marker-alt center" />
                </div>
                <div className="col-8-10">
                  <input
                    type="text"
                    name="location"
                    value={location}
                    className="expandedTimeslotInput form-control"
                    onChange={this.handleChange}
                    placeholder={texts.location}
                    required
                  />
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-2-10" />
                <div className="col-8-10">
                  <span className="invalid-feedback" id="locationErr" />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <img
                    style={{ opacity: 0.54 }}
                    src={Images.couple}
                    className="center"
                    alt="couple icon"
                  />
                </div>
                <div className="col-6-10">
                  <h4 className="verticalCenter">{texts.parents}</h4>
                </div>
                <div className="col-2-10">
                  <input
                    type="number"
                    name="requiredParents"
                    value={requiredParents}
                    min={1}
                    required
                    className="expandedTimeslotInput form-control"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-2-10" />
                <div className="col-8-10">
                  <span className="invalid-feedback" id="requiredParentsErr" />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <img
                    style={{ opacity: 0.54 }}
                    src={Images.babyFace}
                    className="center"
                    alt="baby face icon"
                  />
                </div>
                <div className="col-6-10">
                  <h4 className="verticalCenter">{texts.children}</h4>
                </div>
                <div className="col-2-10">
                  <input
                    type="number"
                    name="requiredChildren"
                    value={requiredChildren}
                    min={1}
                    className="expandedTimeslotInput form-control"
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-2-10" />
                <div className="col-8-10">
                  <span className="invalid-feedback" id="requiredChildrenErr" />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-bookmark center" />
                </div>
                <div className="col-8-10">
                  <Select
                    value={category}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "category",
                    }}
                  >
                    <MenuItem value="learning">
                      <MenuBook />
                      <div className="categoryText">{texts.learning}</div>
                    </MenuItem>
                    <MenuItem value="nature">
                      <EmojiNature />
                      <div className="categoryText">{texts.nature}</div>
                    </MenuItem>
                    <MenuItem value="tourism">
                      <Museum />
                      <div className="categoryText">{texts.tourism}</div>
                    </MenuItem>
                    <MenuItem value="hobby">
                      <SportsBaseball />
                      <div className="categoryText">{texts.hobby}</div>
                    </MenuItem>
                    <MenuItem value="accompanying">
                      <Commute />
                      <div className="categoryText">{texts.accompanying}</div>
                    </MenuItem>
                    <MenuItem value="entertainment">
                      <Mood />
                      <div className="categoryText">{texts.entertainment}</div>
                    </MenuItem>
                    <MenuItem value="parties">
                      <Cake />
                      <div className="categoryText">{texts.parties}</div>
                    </MenuItem>
                    <MenuItem value="coplaying">
                      <Event />
                      <div className="categoryText">{texts.coplaying}</div>
                    </MenuItem>
                    <MenuItem value="other">
                      <ChildCare />
                      <div className="categoryText">{texts.other}</div>
                    </MenuItem>
                  </Select>
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-align-left center" />
                </div>
                <div className="col-8-10">
                  <textarea
                    rows="1"
                    name="description"
                    className="expandedTimeslotInput center"
                    placeholder={texts.description}
                    value={description}
                    onChange={(event) => {
                      this.handleChange(event);
                      autosize(document.querySelectorAll("textarea"));
                    }}
                  />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-euro-sign center" />
                </div>
                <div className="col-8-10">
                  <input
                    type="text"
                    name="cost"
                    value={cost}
                    className="expandedTimeslotInput"
                    onChange={this.handleChange}
                    placeholder={texts.cost}
                  />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">
                  <i className="fas fa-link center" />
                </div>
                <div className="col-8-10">
                  <input
                    type="text"
                    name="link"
                    value={link}
                    className="expandedTimeslotInput"
                    onChange={this.handleChange}
                    placeholder={texts.link}
                  />
                </div>
              </div>
              <div className="row no-gutters" style={rowStyle}>
                <h3>{texts.footer}</h3>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withLanguage(CreateTimeslotModal);

CreateTimeslotModal.propTypes = {
  handleSave: PropTypes.func,
  language: PropTypes.string,
  handleClose: PropTypes.func,
  data: PropTypes.object,
  expanded: PropTypes.bool,
};
