import React from "react";
import Texts from "../Constants/Texts";
import axios from "axios";
import ChooseGroupList from "./ChooseGroupList";



class ChildProfileGroupScreen extends React.Component{
  constructor(props){
    super(props)
    const {profileId, childId} = this.props.match.params
    this.state = {
      profileId: profileId,
      childId: childId,
      groups: [],
      child_groups: []
    }

  }
  /* trovare i gruppi dell'utente */ 
  getMyGroups = async (id) => {
    return axios
      .get(`/api/users/${id}/groups`)
      .then((response) => {
        return response.data;
      })
      
  };
  /* trovare i gruppi di cui fa già parte l'account bambino */
  getMyChildGroups = async (id) => {
    return axios
      .get(`/api/users/${id}/childgroups`)
      .then((response) => {
        return response.data;
      })
      
  };
  /* salva i nuovi gruppi del bambino/a */
  handleSave = ()=>{
    const groups = document.getElementsByClassName('choices')
    const {childId} = this.state
    const {history} = this.props
    for(var i=0 ; i < groups.length ; i++){
      if(groups[i].checked){
        axios
        .post(`/api/childrenProfile/${groups[i].id}/members/${childId}`)
      } else {
        axios
        .delete(`/api/groups/${groups[i].id}/members/${childId}`)
      }
    }
    history.goBack();
    
  }

  async componentDidMount(){
    const list = await this.getMyGroups(this.state.profileId) /* crea la lista delle scelte in base ai gruppi a cui è iscritto l'utente */
    const list_child = await this.getMyChildGroups(this.state.childId) /* marca i gruppi a cui il ragazzo/a è già iscritto */
    

    
    const child_groups = []
    for(var j=0 ; j<list_child.length ; j++){
      list_child[j] = list_child[j].group_id

    }
    for(var i=0 ; i<list.length ; i++){
      list[i] = list[i].group_id
      if(list_child.includes(list[i])){
        child_groups.push(true)
      } else {
        child_groups.push(false)
      }
    }
    
    this.setState(
      {
        groups: list,
        child_groups: child_groups
      }
    )
  }

  renderGroupSection = () => {
    const { language, history } = this.props;
    const {groups, child_groups} = this.state;
    const texts = Texts['it'].myFamiliesShareScreen;
    return (
      <div>
        <div id="profileHeaderContainer">
          <div className="row no-gutters" id="profileHeaderOptions">
            <div className="col-2-10">
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={() => history.goBack()}
                >
                  <i className="fas fa-arrow-left" />
                </button>
            </div>
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleSave}
              >
                <i className="fas fa-check" />
              </button>
            </div>
          </div>
        </div>
        <div className="myGroupsContainer">
          <div className="myGroupsContainerHeader">{texts.myGroups} </div>
          {groups.length > 0 ? (
            <ChooseGroupList groupIds={groups} groupBools={child_groups}/>
          ) : (
            <div className="myGroupsContainerPrompt">{texts.myGroupsPrompt}</div>
          )}
        </div>
      </div>
    );
  };

  render(){
    return (
      <div>
        {this.renderGroupSection()}
      </div>
    )
  }
}

export default ChildProfileGroupScreen;
