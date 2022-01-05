import React from "react";
import axios from "axios";
import Log from "./Log";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#0a848f",
    },
  },
});

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
  /* funzione che verifica nel database i permessi del bambino */
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
     /* riempimento dei diritti del bambino*/
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
    const { language } = this.props;
     /* cambia il diritto del bambino di creare un'attività nello state */
    const switchActivity = ()=> { this.setState({activity: !this.state.activity}) }
    /* cambia il diritto del bambino di scrivere in chat nello state */
    const switchChat = ()=> { this.setState({chat: !this.state.chat}) }
    /* cambia il diritto del bambino di partecipare ad un'attività nello state */
    const switchPartecipation = ()=> { this.setState({partecipation: !this.state.partecipation}) }
    /* cambia il diritto del bambino di modificare il proprio profilo nello state */
    const switchManage = ()=> { this.setState({manage: !this.state.manage}) }

    return (
      <div id="editChildProfileInfoContainer" className="horizontalCenter">
        <div className="rights" id="changeRightsContainer">
          <div className="row no-gutters">
            <div className="col-10-10">
              <div className="center">
                <h1>Permessi</h1>
              </div>
            </div>
            <div className="col-1-10"></div>
            <div className="col-2-10">
              <h1 className="profileToggleText">{"Activity"}</h1>
              <MuiThemeProvider theme={theme}>
                <Switch
                  id="choices_rights1"
                  color="secondary"
                  checked={this.state.activity}
                  onClick={function(){switchActivity()}}
                />
            
              </MuiThemeProvider>
            </div>
            <div className="col-2-10">
              <h1 className="profileToggleText">{"Chat"}</h1>
              <MuiThemeProvider theme={theme}>
                <Switch
                  id="choices_rights2"
                  color="secondary"
                  checked={this.state.chat}
                  onClick={function(){switchChat()}}
                  
                />
              </MuiThemeProvider>
              </div>
              <div className="col-3-10">
                <h1 className="profileToggleText">{"Partecipation"}</h1>
                <MuiThemeProvider theme={theme}>
                  <Switch
                    id="choices_rights3"
                    color="secondary"
                    checked={this.state.partecipation}
                    onClick={function(){switchPartecipation()}}
                  />
                </MuiThemeProvider>
              </div>
              <div className="col-2-10">
                <h1 className="profileToggleText">{"Manage"}</h1>
                <MuiThemeProvider theme={theme}>
                  <Switch
                    id="choices_rights4"
                    color="secondary"
                    checked={this.state.manage}
                    onClick={function(){switchManage()}}
                  />
                </MuiThemeProvider>
              </div>
            </div>
            <hr/>
          </div>
        </div>
    );
  }
}



export default ChangeRights;
