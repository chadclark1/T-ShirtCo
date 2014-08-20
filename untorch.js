/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
function jqueryCookie ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

};

(function() {
	var $;

	var _campaignId,
		_homeUrl,
		_backdrop,
		_loading,
		_alert;

	var FIRST_SU_COOKIE_NAME = "untorch-fsu";
	var SECOND_SU_COOKIE_NAME = "untorch-ssu";


	var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


	if (window.location.href.indexOf('localhost') == -1) {
		//production
		_homeUrl = 'http://people-clothing.com';
	} else {
		//dev
		_homeUrl = 'http://localhost:3000';
	}

	var displayError = function (message) {
		$(_alert).html(message);
		$(_alert).show();
	};

	var hideError = function () {
		$(_alert).html("");
		$(_alert).hide();
	};

	var findInCookie = function(cookieStr) {
		if (cookieStr === null || cookieStr === undefined || cookieStr === "")
			return false;
		var campaigns = cookieStr.split(',');

		for (var i = 0; i < campaigns.length; i ++) {
			if (campaigns[i] == _campaignId) {
				return true;
			}
		}
		return false;
	};

	var addToCookie = function (cookieStr, cookieName) {
		if (cookieStr === undefined || cookieStr === "") {
			cookieStr = _campaignId.toString();
		}
		else {
			cookieStr += "," + _campaignId;
			$.removeCookie(cookieName);
		}
		$.cookie(cookieName, cookieStr, {expires: 1});
	};

	var logCookie = function () {
		var cookie1 = $.cookie(FIRST_SU_COOKIE_NAME);

		var inCookie1 = (cookie1 !== undefined) && (findInCookie(cookie1));
		if (inCookie1) {
			//move to cookie2
			var cookie2 = $.cookie(SECOND_SU_COOKIE_NAME);
			addToCookie(cookie2, SECOND_SU_COOKIE_NAME);
			return;
		}

		//not in cookie1; add it!
		addToCookie(cookie1, FIRST_SU_COOKIE_NAME);
	};

	var getReferralToken = function () {
		//get everything after the '?' not including the '?'
		var query = window.location.search.substring(1);
		var params = query.split("&");

		//dig through and try to find it
		for(var i = 0; i < params.length; i++) {
			var pair = params[i].split("=");
			if (pair[0] === "ref") {
				return pair[1];
			}
		}
	};

	var isValidEmail = function (email) {
		//check that something is there
		if (email === undefined || email === null || email === "")
			return false;

		if (typeof email != "string")
			return false;

		if (email.indexOf("@") === -1)
			return false;

		//check if email looks like an email
		if (! EMAIL_REGEX.test(email))
			return false;

		return true;
	};

	var isRepeatOffender = function () {
		//do they have a 2nd signup cookie?
		var cookie = $.cookie(SECOND_SU_COOKIE_NAME);
		return findInCookie(cookie);
	};

	var signup = function (email) {
		// console.log("email:", email);

		if (isRepeatOffender()) {
			displayError("We like your enthusiasm but try sharing this with your friends!");
			return;
		}

		if (! isValidEmail(email)) {
			displayError("Invalid email address");
			return;
		}

		//check for referralToken
		var referrerToken = getReferralToken();

		var data = {
			email : email,
			referrerToken : referrerToken
		};

		openDialog();

		$.post(_homeUrl + "/api/campaign/" + _campaignId + "/signup", data)
			.done(function (data) {
				hideError();
				logCookie();
				openIframe(data.referralToken);
			})
			.fail(function (error, message, statusText) {
				_backdrop.remove();
				if (error.status === 400)
					displayError("Invalid email address");
				else
					displayError("Sorry, there was an error signing up");
			});
	};

	var connectForm = function (textField, button) {
		button.click(function (event) {
			var email = textField.val();
			signup(email);
			event.preventDefault();
		});
	};

	var createForm = function (scriptElement) {

		// console.log("Creating the form now!");

		var container = $("<form>")
			.attr("class", "untorch-form-container")
			.css({
				'max-width': '500px'
				'text-align': 'center',
			});

		var textField = $("<input>")
			.attr("class", "untorch-email-input")
			.css({
				'padding': '10px 16px'
			})
			.attr("data-untorch-element", "email")
			.attr("placeholder", "Email address")
			.css({
				'display': 'block',
				'box-sizing': 'border-box',
				'width': '90%',
				'font-size': '18px',
				'margin-bottom': '15px',
				'line-height': '28px',
				'border-radius': '6px',
				'margin': '0 auto',
				
			});

		var button = $("<button>")
			.attr("type", "submit")
			.attr("class", "untorch-submit-button")
			.attr("data-untorch-element", "submit")
			.css({
				'background-color': '#1abc9c',
				'color': 'white',
				'-webkit-border-radius': '0 6px 6px 0',
				'-moz-border-radius': '0 6px 6px 0',
				'border-radius': '0 6px 6px 0',
				'border': '0',
				'line-height': '22px',
				'font-size': '17px',
				'font-weight':'500px',
				'margin': '0 auto',

			})
			.append('<span class="untorch-submit-button-inner"> Get Early Access </span>')
			.css({
				'display': 'block',
				'padding': '0 50px',
				'font-size': '18px',
				'margin-bottom': '15px',
				'line-height': '40px'
			});

		_alert = $('<div id="untorch-alert"></div>')
			.css({
				color: "#a94442",
				'background-color': "#f2dede",
				padding: "15px",
				border: "1px solid #ebccd1",
				'border-radius': "4px",
				'margin-bottom': '15px'
			});

		hideError();

		container.append(textField);
		container.append(_alert);
		container.append(button);

		scriptElement.after(container);

		connectForm(textField, button);
	};

	var openDialog = function () {

		_backdrop = $("<div>")
			.attr("class", "untorch-backdrop")
			.css({
				position: "fixed",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				'background-color': "rgba(0, 0, 0, 0.5)",
				'z-index': 2147483645
			});

		_loading = $('<div id="loading" ><b>Loading...</b></div>')
			.css({
				color : "white",
				position: "fixed",
				top: "50%",
				left: "47%",
			});

		_backdrop.append(_loading);

		$("body")
			.css("overflow", "hidden !important")
			.prepend(_backdrop);
	};

	var openIframe = function (referralToken) {

		var iframe = $("<iframe>")
			.attr("id", "untorch-iframe")
			.attr("src", _homeUrl + "/campaigns/" + _campaignId + "/confirmation/" + referralToken)
			.attr("frameborder", "0")
			.css({
				position: "fixed",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				'z-index': 2147483647
		});

		$("body").prepend(iframe);
		$(_loading).remove();

		setTimeout(function () {
			$("#untorch-iframe")[0].contentWindow.focus();

		}, 100);
	};

	var closeDialog = function (event) {
		// console.log("Closing Untorch Dialog...");
		event.origin = "_homeUrl";

		$("#untorch-iframe").remove();
		$(".untorch-backdrop").remove();

		$("body").css("overflow", "auto");
	};

	if (window.addEventListener) {
		window.addEventListener('message', closeDialog);
	} else {
		window.attachEvent('onmessage', closeDialog);
	}
	
	///////////////
	// INITIALIZE
	///////////////

	var bootstrap = function (scriptElement) {

		var textField = $("[data-untorch-element=\"email\"]").eq(0);
		var button = $("[data-untorch-element=\"submit\"]").eq(0);

		if (textField.length == 1 && button.length == 1) {
			connectForm(textField, button);
		} else {
			createForm(scriptElement);
		}

	};
	
	var untorch = function () {
		var found = false;

		$("script").each(function (index, element) {
			element = $(element);
			if (element.attr("data-untorch-campaign")) {
				found = true;
				_campaignId = parseInt(element.attr("data-untorch-campaign"), 10);
				$(document).ready(function () {
					bootstrap(element);
				});
				
			}
		});

		if (!found) {
			console.error("Error: unable to load untorch");
		}

		jqueryCookie($);
	};

	//////////////////////////
	// ENSURE WE HAVE JQUERY
	//////////////////////////

	//check if we have jquery
	if (window.jQuery) {
		$ = window.jQuery;
		untorch();
	} else {
		// Load the script
		var script = document.createElement("SCR" + "IPT");
		script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
		script.type = 'text/javascript';
		document.getElementsByTagName("head")[0].appendChild(script);

		// Poll for jQuery to come into existance
		var checkReady = function() {
			if (window.jQuery) {
				$ = window.jQuery;
				untorch();
			}
			else {
				window.setTimeout(function() { checkReady(); }, 100);
			}
		};

		// Start polling...
		checkReady();
	}
})();