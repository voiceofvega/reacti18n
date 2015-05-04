
var IntlMixin       = ReactIntl.IntlMixin;
var FormattedDate   = ReactIntl.FormattedDate;
var FormattedMessage = ReactIntl.FormattedMessage;

/**
 * This class displays a Login Form, with Login/Password fields.
 */
var LoginForm = React.createClass({
  mixins: [IntlMixin],
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
      <h4>{this.getIntlMessage("LoginForm.title")}</h4>
      <form onSubmit={this.doLogin} action="javascript:;">
        <div className="form-group">
          <label htmlFor="helperlogin">{this.getIntlMessage("LoginForm.loginLabel")}</label>
          <input type="text" className="form-control" id="helperlogin" placeholder={this.getIntlMessage("LoginForm.loginPlaceholder")} defaultValue={this.props.defaultLogin}/>
        </div>
        <div className="form-group">
          <label htmlFor="helperpass">{this.getIntlMessage("LoginForm.passLabel")}</label>
          <input type="password" className="form-control" id="helperpass" placeholder={this.getIntlMessage("LoginForm.passPlaceholder")} defaultValue={this.props.defaultPass}/>
        </div>
        <div id="login-remember-tooltip" className="checkbox" data-placement="top" title={this.getIntlMessage("LoginForm.rememberTooltip")}>
          <label>
            <input type="checkbox" defaultChecked={false} /> {this.getIntlMessage("LoginForm.rememberInfo")}
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-block">{this.getIntlMessage("LoginForm.loginButton")}</button>
      </form>
    </div>
    );
  }
});

/**
 * Once logged, this class displays the username.
 */
var LoggedLine = React.createClass({
  mixins: [IntlMixin],
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
          {this.props.loggedName} (<FormattedMessage message={this.getIntlMessage("LoggedLine.numchars")} numChars={this.props.loggedName.length} />)
        </div>
        <div id="logged-line-tooltip" className="col-xs-2" title={this.getIntlMessage("LoggedLine.deconnexion")} data-placement="left" >
          <a href="javascript:;" onClick={this.goDelog} style={{"fontWeight":"bold","color":"red"}}>x</a>
        </div>
        <div>
          <FormattedMessage message={this.getIntlMessage("LoggedLine.rendered")} dateRendered={new Date()} />
        </div>
        <div>
          <FormattedMessage message={this.getIntlMessage("LoggedLine.loginGender")} gender={this.props.loggedName} />
        </div>
      </div>
    );
  }
});



/**
 * This widget shows the LoginForm when not logged, and the LoggedLine otherwise.
 */
var LoginWidget = React.createClass({
  mixins: [IntlMixin],
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
      alert(this.getIntlMessage("LoginForm.errorLogin"));
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
  xl_fr : {
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
      numchars: "{numChars, plural, =0 {aucun caractère} one {1 caractère} other {# caractères}}",
      deconnexion: "Déconnexion",
      rendered: "Rendu le {dateRendered,date,medium}",
      loginGender: "{gender, select, homme {un homme est logué} femme {une femme est loguée} other {une personne est loguée}}."
    }
  },
  xl_en : {
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
      numchars: "{numChars, plural, =0 {no character} one {1 char} other {# chars}}",
      deconnexion: "Disconnect",
      rendered: "Rendered on {dateRendered,date,medium}",
      loginGender: "{gender, select, homme {a man is logged} femme {a woman is logged} other {a person is logged}}."
    }
  }
};

function renderLocalized(userLocale) {
  userLocale = userLocale.replace("_","-");
  var langFile = XLations.xl_en;
  if(userLocale.indexOf("en") == 0) {
    langFile = XLations.xl_en;
  } else {
    langFile = XLations.xl_fr;
  }
  var intlData = {
      "locales": userLocale,
      "messages": langFile
  };  
  React.render(
    <LoginWidget {...intlData} key={userLocale} />,
    document.getElementById('loginformcontainer')
  );

}

$(document).ready(function() {
  var retrvdLocale = retrieveFromCookie();
  if(retrvdLocale == null) {
    var navLocale = navigator.languages? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    retrvdLocale = navLocale;
  }
  renderLocalized(retrvdLocale);
});
