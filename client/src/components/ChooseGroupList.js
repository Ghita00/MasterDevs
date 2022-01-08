import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import ChooseGroupItem from "./ChooseGroupItem";
import withLanguage from "./LanguageContext";

const ChooseGroupList = ({ groupIds, groupBools }) => {
  const { length } = groupIds;
  const blocks = [...Array(Math.ceil(length / 4)).keys()];
  return (
    <div className="suggestionsContainer">
      <br/>
      <br/>
      <ul>
          
        {blocks.map((block, blockIndex) => {
          let indexes;
          if (length <= 4) {
            indexes = [...Array(length).keys()];
          } else {
            indexes = [
              ...Array(
                (block + 1) * 4 <= length ? 4 : length - block * 4
              ).keys(),
            ].map((x) => block * 4 + x);
          }
          return (
            <LazyLoad key={blockIndex} height={350} once offset={150}>
            
              {indexes.map((index) => (
                
                <div className="row no-gutters">
                  <div className="col-2-10"></div>
                  <div className="col-1-10">
                    <li key={index} style={{ margin: "2rem 0" }}>
                      {
                        groupBools !== undefined ? /* controlla se l'opzione del gruppo deve essere marcata, questo serve se stai creando un nuovo account o lo stai aggiungendo/rimuovendo da un gruppo dopo */
                        <input type="checkbox"  className="choices horizontalCenter" onClick="this.checked=!this.checked;" id = {groupIds[index]} value = {groupIds[index]} checked={groupBools[index] }/>
                        : 
                        <input type="checkbox"  className="choices horizontalCenter" onClick="this.checked=!this.checked;" id = {groupIds[index]} value = {groupIds[index]}/>
                      }
                    <br/>
                    </li>
                    
                  </div>
                  <div className="col-5-10">
                    <ChooseGroupItem groupId={groupIds[index]}  />
                  </div>
                </div>
                
              ))}
            </LazyLoad>
          );
        })}
      </ul>
    </div>
  );
};

ChooseGroupList.propTypes = {
  groupIds: PropTypes.array,
};

export default withLanguage(ChooseGroupList);
