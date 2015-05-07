

/**
 * This class displays a Login Form, with Login/Password fields.
 */
var LoginForm = React.createClass({
  propTypes: {
    defaultLogin: React.PropTypes.string,
    defaultPass: React.PropTypes.string,
    displayVal: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      defaultLogin: "",
      defaultPass: "",
      displayVal: "none"
    };
  },
  doLogin: function() {
    var loggedCallback = this.props.goLogged;
    loggedCallback($('#helperlogin').val(), $('#helperpass').val());
  },
  componentDidMount: function() {
    $('#login-remember-tooltip').tooltip();
  },
  render: function() {
    LOGGER.debug("LoginForm.render starts");
    return (
    <div className="container" id="loginform" style={{"maxWidth":"250px", "display":this.props.displayVal}}>
      <h4>{i18n.t("LoginForm.title")}</h4>
      <form onSubmit={this.doLogin} action="javascript:;">
        <div className="form-group">
          <label htmlFor="helperlogin">{i18n.t("LoginForm.loginLabel")}</label>
          <input type="text" className="form-control" id="helperlogin" placeholder={i18n.t("LoginForm.loginPlaceholder")} defaultValue={this.props.defaultLogin}/>
        </div>
        <div className="form-group">
          <label htmlFor="helperpass">{i18n.t("LoginForm.passLabel")}</label>
          <input type="password" className="form-control" id="helperpass" placeholder={i18n.t("LoginForm.passPlaceholder")} defaultValue={this.props.defaultPass}/>
        </div>
        <div id="login-remember-tooltip" className="checkbox" data-placement="top" title={i18n.t("LoginForm.rememberTooltip")}>
          <label>
            <input type="checkbox" defaultChecked={false} /> {i18n.t("LoginForm.rememberInfo")}
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-block">{i18n.t("LoginForm.loginButton")}</button>
      </form>
    </div>
    );
  }
});

/**
 * Once logged, this class displays the username.
 */
var LoggedLine = React.createClass({
  propTypes: {
    loggedName: React.PropTypes.string,
    displayVal: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      loggedName: "",
      displayVal: "none"
    };
  },
  componentDidMount: function() {
    LOGGER.debug("LoggedLine.componentDidMount.");
    $('#logged-line-tooltip').tooltip();
  },
  goDelog: function() {
    LOGGER.debug("LoggedLine.goDelog");
    this.props.goDelog();
  },
  render: function() {
    LOGGER.debug("LoggedLine.render starts");
    return (
      <div className="row" style={{"paddingTop":"10px","paddingLeft":"10px","paddingRight":"10px","fontSize":"85%","display":this.props.displayVal}}>
        <div className="col-xs-10">
          {this.props.loggedName} ({i18n.t("LoggedLine.numchars", {"count": this.props.loggedName.length} )} )
        </div>
        <div id="logged-line-tooltip" className="col-xs-2" title={i18n.t("LoggedLine.deconnexion")} data-placement="left" >
          <a href="javascript:;" onClick={this.goDelog} style={{"fontWeight":"bold","color":"red"}}>x</a>
        </div>
        <div>
          {i18n.t("LoggedLine.rendered", {dateRendered:moment(new Date()).format("LLL")} ) }
        </div>
        <div>
          {i18n.t("LoggedLine.loginGender", {context: this.props.loggedName} ) }
        </div>
      </div>
    );
  }
});



/**
 * This widget shows the LoginForm when not logged, and the LoggedLine otherwise.
 */
var LoginWidget = React.createClass({
  getInitialState: function() {
    return {
      logged: false,
      loggedName: "",
      loggedPass: ""
    };
  },
  goLogged: function(_loggedName, _loggedPass) {
    LOGGER.debug("LoginWidget.goLogged: " + _loggedName);
    if(_loggedPass !== 'pass') {
      alert(i18n.t("LoginForm.errorLogin"));
      this.setState({logged:false});
    } else {
      this.setState({logged:true, loggedName:_loggedName, loggedPass:_loggedPass});
    }
  },
  goDelog: function() {
    LOGGER.debug("LoginWidget.goDelog.");
    this.setState({logged:false});
  },
  languageChanged: function(newLocale) {
    var newLang = newLocale.id;
    LOGGER.info("LoginWidget.languageChanged to " + newLang);
    renderLocalized(newLang);
    saveLocale(newLang);
  },
  render: function() {
    LOGGER.debug("LoginWidget.render");
    var loginDisplay;
    var loggedDisplay;
    if(!this.state.logged) {
      LOGGER.debug("LoginWidget.rendering state NOT LOGGED");
      loginDisplay = "block";
      loggedDisplay = "none";
    } else {
      loginDisplay = "none";
      loggedDisplay = "block";
    }
    var languages = [
      {id: 'en-US',title: 'English (US)',name: ' English (US)',flagImg: 'lib/pls/images/flags/us.png',flagTitle: 'United States'},
      {id: 'fr-FR',title: 'French (France)',name: ' Français (France)',flagImg: 'lib/pls/images/flags/fr.png',flagTitle: 'France'}
    ];

    return (
      <div style={{"paddingLeft":"4px", "maxWidth":"250px"}}>
        <PolyglotLanguageSwitcher items={languages} selectedLang={this.props.locales} onLanguageChanged={this.languageChanged} openMode="hover" />
        <LoginForm displayVal={loginDisplay}  loggedName={this.state.loggedName}  loggedPass={this.state.loggedPass} goLogged={this.goLogged} />
        <LoggedLine displayVal={loggedDisplay} loggedName={this.state.loggedName} goDelog={this.goDelog} />
      </div>
    );
  }
});

var LOGGER = (function() {
  var DBG = 0;
  var INFO = 1;
  var WARN = 2;
  var ERR = 3;
  var NONE = 99;
  var level = DBG;
  function _setLevel(level) {
    if(level === "DEBUG") {
      level = DBG;
    } else if(level === "INFO") {
      level = INFO;
    } else if(level === "WARNING") {
      level = WARN;
    } else if(level === "ERROR") {
      level = ERR;
    } else {
      level = NONE;
    }
  }
  function _debug(m) {
    if(level <= DBG) {
      console.log("[DBG] " + m);
    }
  }
  function _info(m) {
    if(level <= INFO) {
      console.log("[INFO] " + m);
    }
  }
  function _warning(m) {
    if(level <= WARN) {
      console.log("[WARN] " + m);
    }
  }
  function _error(m) {
    if(level <= ERR) {
      console.log("[ERR] " + m);
    }
  }
  return {
    setLevel: _setLevel,
    debug: _debug,
    info: _info,
    warning: _warning,
    error: _error
  }
})();

function retrieveFromCookie() {
  var userLocale = null;
  try {
    var cookies = document.cookie.split(';');
    for(var i=0; i<cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0)===' ') cookie = cookie.substring(1);
      if (cookie.indexOf("r18locale=") === 0) {
        userLocale = cookie.substring("r18locale=".length,cookie.length);
        LOGGER.debug("Retrieved UserLocale: " + userLocale);
      }
    }
  } catch(e) { LOGGER.error(e); }
  return userLocale;
};
function saveLocale(newLocale) {
  LOGGER.debug("saveLocale: " + newLocale);
  var expiresDays = 60;  // 3 months
  var d = new Date();
  d.setTime(d.getTime() + (expiresDays*24*3600000));
  var expires = "expires="+d.toUTCString();
  document.cookie = "r18locale=" + newLocale + "; " + expires;
};



var XLations = {
  fr : {
    LoginForm: {
      errorLogin: "Echec du Login.",
      title: "Formulaire pour Login",
      loginLabel: "Email (login)",
      loginPlaceholder: "Votre email",
      passLabel: "Mot de passe",
      passPlaceholder: "Password", 
      rememberTooltip: "Non recommandé sur un ordinateur partagé.",
      rememberInfo: "Mémoriser ces informations",
      loginButton: "Login"
    },
    LoggedLine: {
      numchars: "__count__ caractère",
      numchars_plural: "__count__ caractères",
      deconnexion: "Déconnexion",
      rendered: "Rendu le {dateRendered,date,medium}",
      loginGender_context: "une personne est loguée",
      loginGender_context_male: "un homme est logué",
      loginGender_context_female: "une femme est loguée"
    }
  },
  en_US : {
    LoginForm: {
      errorLogin: "Login failed. Please check your Internet connection and the login information.",
      title: "Login form",
      loginLabel: "Email (login)",
      loginPlaceholder: "Your email",
      passLabel: "Password",
      passPlaceholder: "Password", 
      rememberTooltip: "Strongly discouraged on a public computer.",
      rememberInfo: "Remember information",
      loginButton: "Login"
    },
    LoggedLine: {
      numchars: "__count__ char",
      numchars_plural: "__count__ chars",
      deconnexion: "Disconnect",
      rendered: "Rendered on {dateRendered,date,medium}",
      loginGender_context: "a person is logged",
      loginGender_context_male: "a man is logged",
      loginGender_context_female: "a woman is logged"
    }
  }
};


function renderLocalized(userLocale) {
  moment.locale(userLocale);
  i18n.setLng(userLocale, function(t) { 
    /* loading done */ 
    React.render(
      <LoginWidget locales={userLocale} />,
      document.getElementById('loginformcontainer')
    );
  });
}

$(document).ready(function() {
  var retrvdLocale = retrieveFromCookie();
  if(retrvdLocale == null) {
    var navLocale = navigator.languages? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    retrvdLocale = navLocale;
  }
  i18n.init({ cookieName: 'r18locale' }, function(t) { renderLocalized(retrvdLocale); });
  
});
