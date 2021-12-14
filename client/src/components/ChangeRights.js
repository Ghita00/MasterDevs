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
        
        <form
          ref={(form) => {
            this.formEl = form;
          }}
            className="rights"
            style={{margin:'3rem' }}
          >
            <h1>Diritti</h1>
            <label class="toggle" for="uniqueID">
			        <input type="checkbox" class="toggle__input" id="uniqueID" />
			        <span class="toggle-track">
				        <span class="toggle-indicator">
					        <span class="checkMark">
						        <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
							        <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
						        </svg>
					        </span>
				        </span>
			        </span>
			        Enabled toggle label
		        </label>

            <label class="toggle" for="uniqueID">
			        <input type="checkbox" class="toggle__input" id="uniqueID" />
			        <span class="toggle-track">
				        <span class="toggle-indicator">
					        <span class="checkMark">
						        <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
							        <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
						        </svg>
					        </span>
				        </span>
			        </span>
			        Enabled toggle label
		        </label>

            <label class="toggle" for="uniqueID">
			        <input type="checkbox" class="toggle__input" id="uniqueID" />
			        <span class="toggle-track">
				        <span class="toggle-indicator">
					        <span class="checkMark">
						        <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
							        <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
						        </svg>
					        </span>
				        </span>
			        </span>
			        Enabled toggle label
		        </label>

            <label class="toggle" for="uniqueID">
			        <input type="checkbox" class="toggle__input" id="uniqueID" />
			        <span class="toggle-track">
				        <span class="toggle-indicator">
					        <span class="checkMark">
						        <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
							        <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
						        </svg>
					        </span>
				        </span>
			        </span>
			        Enabled toggle label
		        </label>
            
              <input type="checkbox" className="choices_rights" id= "activity" name="medium" checked= {this.state.activity} onClick={function(){switchActivity()}} />    Activity
            
            
              <input type="checkbox" className="choices_rights" id="chat" name="medium" checked= {this.state.chat} onClick={function(){switchChat()}}/>    Chat
            
            
              <input type="checkbox" className="choices_rights" id="partecipation" name="medium" checked= {this.state.partecipation} onClick={function(){switchPartecipation()}}/>    Partecipation
            
        
              <input type="checkbox" className="choices_rights" id="manage" name="medium" checked= {this.state.manage} onClick={function(){switchManage()}}/>    Manage
        </form>
        <div class="card">
	<div class="content-wrapper">
		<h2 class="heading">Accessible Toggle Switch</h2>
		<p>The following demo shows how to build and style a custom toggle switch using a semantic checkbox.</p>
	</div>

	<div class="demo">
	

		

		<label class="toggle" for="disabledDemo">
			<input type="checkbox" class="toggle__input" id="disabledDemo" disabled />
			<span class="toggle-track">
				<span class="toggle-indicator">
					<span class="checkMark">
						<svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
							<path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
						</svg>
					</span>
				</span>
			</span>
			Disabled toggle label
		</label>
	</div>
</div>

      </div>
    );
  }
}



export default ChangeRights;
