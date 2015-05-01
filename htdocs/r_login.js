
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
      <h4>Formulaire de Login</h4>
      <form onSubmit={this.doLogin} action="javascript:;">
        <div className="form-group">
          <label htmlFor="helperlogin">Utilisateur</label>
          <input type="text" className="form-control" id="helperlogin" placeholder="Votre email" defaultValue={this.props.defaultLogin}/>
        </div>
        <div className="form-group">
          <label htmlFor="helperpass">Mot de passe</label>
          <input type="password" className="form-control" id="helperpass" placeholder="Mot de passe" defaultValue={this.props.defaultPass}/>
        </div>
        <div id="login-remember-tooltip" className="checkbox" data-placement="top" title="Ne faites pas ça sur un ordi partagé !">
          <label>
            <input type="checkbox" defaultChecked={false} /> Se souvenir de moi
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Valider</button>
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
          {this.props.loggedName} ({this.props.loggedName.length} caractères)
        </div>
        <div id="logged-line-tooltip" className="col-xs-2" title="Déconnexion" data-placement="left" >
          <a href="javascript:;" onClick={this.goDelog} style={{"fontWeight":"bold","color":"red"}}>x</a>
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
    var retrvdLocale = retrieveFromCookie();
    if(retrvdLocale != null) {
      LOGGER.info("LoginWidget.getInitialState retrieved "+retrvdLocale);
      return {
      	logged: false,
      	loggedName:"",
      	loggedPass:"",
        locale: retrvdLocale
      };
    }
    var navLocale = navigator.languages? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    LOGGER.info("LoginWidget.getInitialState using Browser Language: " + navLocale);
    return {
      logged: false,
  	  loggedName:"",
  	  loggedPass:"",
      locale: navLocale
    };
  },
  goLogged: function(_loggedName, _loggedPass) {
    LOGGER.debug("LoginWidget.goLogged: " + _loggedName);
    if(_loggedPass !== 'pass') {
      alert("Tout faux.");
      this.setState({logged:false});
    } else {
      this.setState({logged:true, loggedName:_loggedName, loggedPass:_loggedPass});
    }
  },
  goDelog: function() {
    LOGGER.debug("LoginWidget.goDelog.");
    this.setState({logged:false});
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
    return (
      <div style={{"paddingLeft":"4px", "maxWidth":"250px"}}>
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

$(document).ready(function() {
  React.render(
    <LoginWidget />,
    document.getElementById('loginformcontainer')
  );
});