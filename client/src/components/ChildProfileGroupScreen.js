import React from "react";
import Texts from "../Constants/Texts";
import axios from "axios";
// import getMyGroups from "./MyFamiliesShareScreen";
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
    const { language } = this.props;
    const {groups, child_groups} = this.state;
    const texts = Texts['it'].myFamiliesShareScreen;
    return (
      <div className="myGroupsContainer">
        <div className="myGroupsContainerHeader">{texts.myGroups} </div>
        {groups.length > 0 ? (
          <ChooseGroupList groupIds={groups} groupBools={child_groups}/>
        ) : (
          <div className="myGroupsContainerPrompt">{texts.myGroupsPrompt}</div>
        )}
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
