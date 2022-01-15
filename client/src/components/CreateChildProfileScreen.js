import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";
import axios from "axios";
import ChooseGroupList from "./ChooseGroupList";



class CreateChildProfileScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      file:"",
      image:"",
      given_name: "",
      family_name: "",
      gender: "",
      allergies:"",
      other_info:"",
      special_needs:"",
      background:"",
      suspended:false,
      email: "",
      password: "",
      passwordConfirm: "",
      birthdate:"",
      myGroups:[],
      selectedGroups:[]
    };
    
  }
  /* trova i gruppi dell'utente */
  getMyGroups = (id) => {
    return axios
      .get(`/api/users/${id}/groups`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        Log.error(error);
        return [];
      });
  };
  

  async componentDidMount() {
    let id = this.props.match.params.profileId
    const groups = await this.getMyGroups(id);
    const myGroups = groups
     .filter((group) => group.user_accepted && group.group_accepted)
     .map((group) => group.group_id); 
     /*  utilizzata per l'upgrade da bambino a bambino utente */   
    if(this.props.location.info !== undefined){
      sessionStorage.setItem("info", JSON.stringify(this.props.location.info))
    }
    let o = JSON.parse('['+sessionStorage.getItem("info")+']')[0];
    this.setState({
      file:o[0],
      image:o[1],
      given_name: o[2],
      family_name: o[3],
      gender: o[4],
      background:o[5],
      other_info:o[6],
      special_needs:o[7],
      allergies:o[8],
      birthdate: Date.parse(o[9]),
      myGroups: myGroups
      
    })
  }

  renderGroupSection = () => {
    const { language } = this.props;
    const { myGroups } = this.state;
    const texts = Texts[language].myFamiliesShareScreen;
    return (
      <div className="myGroupsContainer ">
        <div className="myGroupsContainerHeader ">
          <div className="row no-gutters">
            <div className="col-2-10"></div>
            <div className="col-2-10">
              <h1 className="center">{texts.myGroups}</h1>
            </div>
            <div className="col-2-10"></div>
          </div>
        </div>
        {myGroups.length > 0 ? (
          <ChooseGroupList groupIds={myGroups} />
        ) : (
          <div className="myGroupsContainerPrompt">{texts.myGroupsPrompt}</div>
        )}
      </div>
    );
  };

  validate = () => {
    const { language } = this.props;
    const { acceptTerms } = this.state;
    const texts = Texts[language].signUpForm;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false || acceptTerms === false) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(`${elem.name}Err`);
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (elem.validity.valueMissing) {
              if (`${elem.name}Err` === "acceptTermsErr") {
                errorLabel.textContent = texts.acceptTermsErr;
              } else {
                errorLabel.textContent = texts.requiredErr;
              }
            } else if (elem.validity.tooShort) {
              errorLabel.textContent = texts.tooShortErr;
            } else if (elem.validity.typeMismatch) {
              errorLabel.textContent = texts.typeMismatchErr;
            } else if (elem.validity.customError) {
              errorLabel.textContent = texts.confirmPasswordErr;
            }
          } else {
            errorLabel.textContent = "";
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
      }
    }

    return true;
  };
  /** funzione di inserimento nel database dei dati recuperati per la conversione o creazione di un bambino utente */
  submit = () => {
    const { history } = this.props;
    const info = this.state;
    const profileId = this.props.match.params.profileId;

    info['id'] = JSON.parse('['+sessionStorage.getItem("info")+']')[0][10];

    axios
      .post(`/api/users/${profileId}/childrenProfile`, info)
      .then((response) => {
        Log.info(response);    
        history.push({
          pathname: `/profiles/${profileId}/children`,
          goback: true
        });
      })
      .catch((error) => {
        Log.error(error);
      }); 
  };

  handleSubmit = (event) => {
    let selectedGroup = []
    let groups = document.getElementsByClassName('choices')
    for(var i=0 ; i<groups.length ; i++){
      if(groups[i].checked){
        selectedGroup.push(groups[i].value);
      }
    }
    
    event.preventDefault();
    if (this.validate()) {
      this.setState({
        selectedGroups: selectedGroup
      },function(){this.submit()});
       
    }
    this.setState({ formIsValidated: true });
  };

  handleChange = (event) => {
    const { password } = this.state;
    const { language } = this.props;
    const { name, value } = event.target;
    if (name === "passwordConfirm") {
      if (password !== event.target.value) {
        event.target.setCustomValidity(
          Texts[language].signUpForm.passwordError
        );
      } else {
        event.target.setCustomValidity("");
      }
    }
    if (name === "acceptTerms") {
      const { acceptTerms } = this.state;
      this.setState({ acceptTerms: !acceptTerms });
    } else {
      this.setState({ [name]: value });
    }
  };

  

  filledInput = () => {
    const { state } = this;
    return (
      (state.email &&
      state.password &&
      state.passwordConfirm)
    );
  };

  render() {
    const { error, language, enqueueSnackbar } = this.props;
    const {
      formIsValidated,
      email,
      password,
      passwordConfirm,
    } = this.state;
    const texts = Texts[language].signUpForm;
    if (error) {
      enqueueSnackbar(`${texts.signupErr} ${email}`, {
        variant: "error",
      });
    }
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    return (
      
        
          
        <form
        ref={(form) => {
          this.formEl = form;
        }}
        onSubmit={this.handleSubmit}
        className={formClass}
        noValidate
      >
        <div id="groupMembersHeaderContainer">
          <div className="row no-gutters" id="profileHeaderOptions">
            <div className="col-2-10">
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={() => { const { history } = this.props;
                  if (history.length === 1) {
                    history.replace("/myfamiliesshare");
                  } else {
                    history.goBack();
                  }
                }}
                >
                  <i className="fas fa-arrow-left" />
                </button>
            </div>
            <div className="col-6-10">
              <h1 className="center">Dati account</h1>
            </div>
            <div className="col-2-10">
              
              <button
                type="submit"
                className="transparentButton center"
              >
                <i className="fas fa-check" />
              </button>
            </div>
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <input
          type="email"
          placeholder={texts.email}
          name="email"
          className="signUpInputField form-control horizontalCenter horizontalCenter"
          onChange={this.handleChange}
          required
          value={email}
        />
        <span className="invalid-feedback" id="emailErr" />
        <input
          placeholder={texts.password}
          type="password"
          name="password"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          required
          minLength={8}
          value={password}
        />
        <span className="invalid-feedback" id="passwordErr" />
        <input
          placeholder={texts.confirmPassword}
          type="password"
          name="passwordConfirm"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          minLength={8}
          required
          value={passwordConfirm}
        />
        <span className="invalid-feedback" id="passwordConfirmErr" />
        <div className="row no-gutters">
          <div className="col-3-10"></div>
          <div className="col-4-10">{texts.passwordPrompt}</div>
        </div>

        {this.renderGroupSection()}
        
      </form>
    );
  }
}

CreateChildProfileScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  error: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
};

function mapStateToProps(state) {
  const { error } = state.registration;
  return {
    error,
  };
}

export default connect(mapStateToProps)(
  withRouter(withSnackbar(withLanguage(CreateChildProfileScreen)))
);
