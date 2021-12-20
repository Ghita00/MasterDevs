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

  getMyGroups = async (id) => {
    return axios
      .get(`/api/users/${id}/groups`)
      .then((response) => {
        return response.data;
      })
      
  };

  getMyChildGroups = async (id) => {
    return axios
      .get(`/api/users/${id}/childgroups`)
      .then((response) => {
        return response.data;
      })
      
  };

  handleSave = ()=>{
    const groups = document.getElementsByClassName('choices')
    const {childId} = this.state
    const {history} = this.props
    for(var i=0 ; i < groups.length ; i++){
      //group_list.push({id: groups[i].id, checked: groups[i].checked})
      if(groups[i].checked){
        console.log('Iscrivi/lascia in '+groups[i].id)
        axios
        .post(`/api/childrenProfile/${groups[i].id}/members/${childId}`)
      } else {
        console.log('Togli da '+groups[i].id)
        axios
        .delete(`/api/groups/${groups[i].id}/members/${childId}`)
      }
    }
    // axios
    // .patch(`/api/childrenProfile/${childId}/setgroups`,{group_list: group_list})
    history.goBack();
    
  }

  async componentDidMount(){
    const list = await this.getMyGroups(this.state.profileId)
    const list_child = await this.getMyChildGroups(this.state.childId)
    

    
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
