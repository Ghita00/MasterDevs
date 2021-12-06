import React from "react";
import axios from "axios";
import Texts from "../Constants/Texts";

class ChangeRightsScreen extends React.Component {
  state = {
    activity: false,
    chat: false,
    partecipation: false,
    manage: false,
  };

  switchActivity(){
    axios.get("api/childProfile/rights/changeactivity")
  }

  switchChat(){
    axios.get("api/childProfile/rights/changechat")
  }

  switchPartecipation(){
    axios.get("api/childProfile/rights/changepartecipation")
  }

  switchManage(){
    axios.get("api/childProfile/rights/changemanage")
  }

  render() {
    const {
      activity,
      chat,
      partecipation,
      manage,
    } = this.state;
    const { language } = this.props;
    const formClass = [];
    const texts = Texts[language].changeRightsScreen;
    return (
      <div id="changeRightsContainer">
        <h1>{texts.prompt}</h1>
        <form
          ref={(form) => {
            this.formEl = form;
          }}
            className={formClass}
          >
          <input type="checkbox" id= "activity" name="medium" onChange={switchActivity} /><span>activity</span>
          <input type="checkbox" id="chat" name="medium" onChange={switchChat}/><span>chat</span>
          <input type="checkbox" id="partecipation" name="medium" onChange={switchPartecipation}/><span>partecipation</span>
          <input type="checkbox" id="manage" name="medium" onChange={switchManage}/><span>manage</span>
          </form>
      </div>
    );
  }
}

export default ChangeRightsScreen;
