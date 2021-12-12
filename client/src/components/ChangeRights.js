import React from "react";
import axios from "axios";
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
  
  render() {
    const {
      activity,
      chat,
      partecipation,
      manage,
      child_id
    } = this.state;
    console.log(this.state)
    const { language } = this.props;
    const formClass = [];

    const switchActivity = ()=>
    {
      //axios.post(`/api/childrenProfile/rights/${child_id}/changeactivity/${activity}`)
      this.setState({activity: !this.state.activity})
    }
    
    const switchChat = ()=>
    {
      //axios.post(`/api/childrenProfile/rights/${child_id}/changeactivity/${activity}`)
      this.setState({chat: !this.state.chat})
    }

    const switchPartecipation = ()=>
    {
      //axios.post(`/api/childrenProfile/rights/${child_id}/changeactivity/${activity}`)
      this.setState({partecipation: !this.state.partecipation})
    }

    const switchManage = ()=>
    {
      //axios.post(`/api/childrenProfile/rights/${child_id}/changeactivity/${activity}`)
      this.setState({manage: !this.state.manage})
    }

    return (
    
      <div id="changeRightsContainer">
        <h1> diritti </h1>
        <form
          ref={(form) => {
            this.formEl = form;
          }}
            className="rights"
          >
          
          <input type="checkbox" className="choices_rights" id= "activity" name="medium" checked= {this.state.activity} onClick={function(){switchActivity()}} /><span>activity</span><br/>
          <input type="checkbox" className="choices_rights" id="chat" name="medium" checked= {this.state.chat} onClick={function(){switchChat()}}/><span>chat</span><br/>
          <input type="checkbox" className="choices_rights" id="partecipation" name="medium" checked= {this.state.partecipation} onClick={function(){switchPartecipation()}}/><span>partecipation</span><br/>
          <input type="checkbox" className="choices_rights" id="manage" name="medium" checked= {this.state.manage} onClick={function(){switchManage()}}/><span>manage</span>
        
          </form>
      </div>
    );
  }
}

export default ChangeRights;
