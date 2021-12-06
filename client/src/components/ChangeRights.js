import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import Log from "./Log"


class ChangeRights extends React.Component {
  constructor(props){
    super(props)
  
    this.state = {
      activity:false,
      chat:false,
      partecipation:false,
      manage:false,
      child_id:null,
    };
  }

  getRights = () => {
    return axios
      .get('api/profiles/${this.state.user_id}/children/${this.state.child_id}/edit/changeRights')
      .then((response) => {
        const rights = response.data;
        this.setState({rights})
      })
      .catch((error) => {
        Log.error(error);
      });
  } 
  componentDidMount(){
    // Da inserire una funzione per recuperare il genitore del figlio in oggetto altrimenti la getRights
    // di questo metodo non funziona bene
    const { rights } = this.getRights();
    this.setState(
      {    
        activity: rights.activity,
        chat: rights.chat,
        partecipation: rights.partecipation,
        manage: rights.manage,
      }
    )
  }

  changeActivity = ()=>
  {
    { 
      this.state.activity = !(this.state.activity)  
    }
  }

  changeChat = ()=>
  {
    {
      this.state.chat = !(this.state.chat) 
    }
  }

  changePartecipation = ()=>
  {
    {
      this.state.partecipation = !(this.state.partecipation) 
    } 
  }

  changeManage = ()=>
  {
    {
      this.state.manage = !(this.state.manage) 
    } 
  }

  handleSubmit = () => {
    const { rights } = {
      activity: this.activity, 
      chat: this.chat, 
      partecipation: this.partecipation, 
      manage: this.manage,
    };
    axios
      .post(
        "api/profiles/${this.state.user_id}/children/${this.state.child_id}/edit/changeRights",
        {
          rights,
        },
        {
          headers: {
            child_user_id: this.state.child_id,
          },
        }
      )
      .then((response) => {
        const child = response.data;
        localStorage.setItem("rights", JSON.stringify(child));
      })
      .catch((error) => {
        Log.error(error);
      });
    }

  render() {
    const { language } = this.props;
    const formClass = [];
    console.log(this.props.id);
    const texts = Texts[language].changeRightsScreen;
    return (
    
      <div id="changeRightsContainer">
        <h1> diritti donne not found</h1>
        <form
          ref={(form) => {
            this.formEl = form;
          }}
            className={formClass}
          >
          <input type="checkbox" id= "activity" name="medium" checked= {this.state.activity} onChange={this.changeActivity} /><span>activity</span>
          <input type="checkbox" id="chat" name="medium" checked= {this.state.chat} onChange={this.changeChat}/><span>chat</span>
          <input type="checkbox" id="partecipation" name="medium" checked= {this.state.partecipation} onChange={this.changePartecipation}/><span>partecipation</span>
          <input type="checkbox" id="manage" name="medium" checked= {this.state.manage} onChange={this.changeManage}/><span>manage</span>
          <button type="button" onClick={this.handleSubmit}>
                {texts.change};
          </button>
          </form>
      </div>
    );
  }
}

export default withRouter(withLanguage(ChangeRights));
