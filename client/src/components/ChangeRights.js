import React from "react";
import axios from "axios";
import Texts from "../Constants/Texts";
import Log from "./Log"


class ChangeRights extends React.Component {
  constructor(props){
    super(props)
  
  this.state = {
    activity: false,
    chat: false,
    partecipation: false,
    manage: false,
    child_id: this.props.id
  };
}

  getRights = () => {
    return axios
    .get(`/api/childrenProfile/rights/${this.state.child_id}/getRights`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
  }
  async componentDidMount(){
    let rights = await this.getRights();
    this.setState(
      {    
        activity: rights.activity,
        chat: rights.chat,
        partecipation: rights.partecipation,
        manage: rights.manage,
      }
    )
  }

  switchActivity = ()=>
  {
    axios.post(`/api/childrenProfile/rights/${this.state.child_id}/changeactivity`)

  }

  switchChat= ()=>
  {
    axios.post(`/api/childrenProfile/rights/${this.state.child_id}/changechat`)
    console.log("fine chat");
  }

  switchPartecipation= ()=>
  {
    axios.post(`/api/childrenProfile/rights/${this.state.child_id}/changepartecipation`)
  }

  switchManage= ()=>
  {
    axios.post(`/api/childrenProfile/rights/${this.state.child_id}/changemanage`)
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
    //console.log(this.props.id);
    // const texts = Texts[language].changeRightsScreen;
    return (
    
      <div id="changeRightsContainer">
        <h1> diritti donne not found</h1>
        <form
          ref={(form) => {
            this.formEl = form;
          }}
            className={formClass}
          >
          <input type="checkbox" id= "activity" name="medium" checked= {this.state.activity} onChange={this.switchActivity} /><span>activity</span>
          <input type="checkbox" id="chat" name="medium" checked= {this.state.chat} onChange={this.switchChat}/><span>chat</span>
          <input type="checkbox" id="partecipation" name="medium" checked= {this.state.partecipation} onChange={this.switchPartecipation}/><span>partecipation</span>
          <input type="checkbox" id="manage" name="medium" checked= {this.state.manage} onChange={this.switchManage}/><span>manage</span>
          </form>
      </div>
    );
  }
}

export default ChangeRights;
