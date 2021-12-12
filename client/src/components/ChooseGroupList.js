import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import ChooseGroupItem from "./ChooseGroupItem";
import withLanguage from "./LanguageContext";

const ChooseGroupList = ({ groupIds }) => {
  const { length } = groupIds;
  const blocks = [...Array(Math.ceil(length / 4)).keys()];
  return (
    <div className="suggestionsContainer">
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
                <li key={index} style={{ margin: "1rem 0" }}>
                  <input type="checkbox"  className="choices" id = {groupIds[index]} value = {groupIds[index]}/>
                  <ChooseGroupItem groupId={groupIds[index]} />
                </li>
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
