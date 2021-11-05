import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import languageActions from "../Actions/LanguageActions";
import "moment/locale/de";
import "moment/locale/el";
import "moment/locale/nl";
import "moment/locale/it";
import "moment/locale/hu";
import "moment/locale/fr";

const LanguageContext = React.createContext();

class LanguageProvider extends React.Component {
  constructor(props) {
    super(props);
    let language = "";

    localStorage.setItem("language", "it"); // TODO: necessario per far partire l'app, da eliminare in production

    if (localStorage.getItem("language")) {
      language = localStorage.getItem("language");
    } else {
      localStorage.setItem(
        "language",
        process.env.REACT_APP_CITYLAB_LANGUAGES.split(" ")[0]
      );
      language = process.env.REACT_APP_CITYLAB_LANGUAGES.split(" ")[0];
    }
    this.state = {
      language,
    };
    moment.locale(language);
  }

  updateLanguage = (language) => {
    const { dispatch } = this.props;
    dispatch(languageActions.update(language));
    this.setState({ language });
    if (process.env.REACT_APP_CITYLAB === "Budapest") {
      moment.locale(language, {
        week: {
          dow: 1,
          doy: 1,
        },
      });
    } else {
      moment.locale(language);
    }
  };

  render() {
    const { language } = this.state;
    const { children } = this.props;
    return (
      <LanguageContext.Provider
        value={{
          language,
          updateLanguage: this.updateLanguage,
        }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }
}
function mapStateToProps(state) {
  const { language } = state;
  return {
    language,
  };
}

const connectedLanguageProvider = connect(mapStateToProps)(LanguageProvider);
export { connectedLanguageProvider as LanguageProvider };

// This function takes a component...
export default function WithLanguage(Component) {
  // ...and returns another component...
  return function LanguageComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <LanguageContext.Consumer>
        {({ language, updateLanguage }) => (
          <Component
            {...props}
            language={language}
            updateLanguage={updateLanguage}
          />
        )}
      </LanguageContext.Consumer>
    );
  };
}

LanguageProvider.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func,
};
