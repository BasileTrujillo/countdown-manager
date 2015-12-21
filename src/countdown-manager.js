/*!
 * Countdown Manager tool v2.0
 *
 * Copyright 2015 Seritech Développement
 *
 * Permet de générer dans un élément DOM un compte a rebour
 * Gere les jours, heures, minutes, secondes
 * Ex: 1j 1h 9m 57s
 *
 * Class compatible jQuery et Javascript natif
 *
 */
countdownManager =
{
    // Configuration
    diff : {                    //Donnés temporelles
        day : 0,
        hour : 0,
        min : 0,
        sec : 0
    },
    alwaysPrintSec : true,      //Si définit à false : n'affiche les secondes que si superieur a 0s
    strCountDown : undefined,   //Text du compte a rebours
    interval : 1000,            //Interval d'une seconde

    elem : undefined,           //Element
    $elem : undefined,          //jQuery element
    jQueryIsOk : undefined,     //jQuery is enabled

    options:
    {
        targetTime: null,       //Date cible du compte à rebours
        callback: null,         //Fonction appelée quand le temps est écoulé
        startDatetime: null     //Datetime du serveur (regle le cas de diff entre l'horloge utilisateur et serveur)
    },

    intervalId : undefined,     //Id du timer

	/**
	 * Initialisation du compte à rebours
	 * element : DOM Element
	 * target_time : new Data();
	 */
    init: function( options, elem )
    {
        //Init attributes
        this.initAtributes(options, elem);

        // Start tick
        this.start();

        // return this so that we can chain and use the bridge with less code.
        return this;
    },

    /**
     * Insert une instance de countdown manager dans un attribut du DOM element
     * @param id            string | objet  Id ou dom element
     * @param options       array           Tableau d'option pour l'initialisation
     *
     * @returns {boolean}
     */
    initByClone: function(id, options)
    {
        if (typeof id == "string")
        {
            var element = document.getElementById(id);
        }
        else if(typeof id == "object")
        {
            var element = id;
        }
        else
        {
            return false;
        }
        element.countdown = clone(this);
        element.countdown.init(options, element);
    },

    /**
     * Initialisation des attributs
     * Merge des option
     * Définition de l'élément DOM
     * @param   array   options
     * @param   DOM|jQuery   element DOM ou jQuery
     */
    initAtributes : function(options, elem) {
        // Mix in the passed-in options with the default options
        if( this.isjQueryOK() )
        {
            //jQuery Style
            this.options = $.extend({}, this.options, options);
        }
        else
        {
            //Native style
            for(var prop in options)
            {
                if (options[prop] !== undefined &&
                    options[prop] !== null &&
                    options[prop] !== "")
                {
                    this.options[prop] = options[prop];
                }
            }
        }

        // Save the element reference, both as a jQuery
        // reference and a normal reference
        this.elem  = elem;
        if ( this.isjQueryOK() ) {
            this.$elem = $(elem);
        }
    },

    /**
     * Verification de l'existance de jQuery
     * @returns bool
     */
    isjQueryOK : function()
    {
        if (this.jQueryIsOk === undefined)
        {
            this.jQueryIsOk = (typeof jQuery !== "undefined");
        }
        return this.jQueryIsOk;
    },

    /**
     * Lancement du compte a rebour (Tick)
     */
    start: function(){
        // Lancement du compte à rebours
        this.tick();
        this.intervalId = setInterval.call(this, this.tick, this.interval);
    },

	/**
	 * Met à jour le compte à rebours (tic d'horloge)
	 */
	tick: function(){
		// Instant présent
        if (this.options.startDatetime === null) {
            var timeNow = new Date();
        } else {
            var timeNow = this.addSecondToDate(this.options.startDatetime, 1);
        }
        
		// On s'assure que le temps restant ne soit jamais negatif (ce qui est le cas dans le futur de targetTime)
		if( timeNow > this.options.targetTime ){
			timeNow = this.options.targetTime;
		}
		
		// Calcul du temps restant
		this.dateDiff(timeNow, this.options.targetTime);
		this.strCountDown = '';
		if(this.diff.day > 0){
			this.strCountDown += this.diff.day+'j ';
		}
		if(this.diff.hour > 0){
			this.strCountDown += this.diff.hour+'h ';
		}
		if(this.diff.min > 0){
			this.strCountDown += this.diff.min+'m ';
		}
		if(this.diff.sec > 0 || this.alwaysPrintSec){
			this.strCountDown += this.diff.sec+'s';
		}

        if(this.isjQueryOK())
        {
            this.$elem.text(this.strCountDown);
        }
        else
        {
            if( typeof this.elem.innerText != "undefined" )
                this.elem.innerText = this.strCountDown;
            else if( typeof this.elem.textContent != "undefined" )
                this.elem.textContent = this.strCountDown;
            else
                this.elem.innerHTML = this.strCountDown;
        }

	},

    /**
     * Calcul la différence entre 2 dates, en jour/heure/minute/seconde
     * @param date1
     * @param date2
     */
    dateDiff: function(date1, date2){
        var tmp = date2 - date1;
        tmp = Math.floor(tmp/1000);                // Nombre de secondes entre les 2 dates
        if (tmp === 0) {
            this.finish();
            return true;
        }
        this.diff.sec = tmp % 60;                  // Extraction du nombre de secondes
        tmp = Math.floor((tmp-this.diff.sec)/60);  // Nombre de minutes (partie entière)
        this.diff.min = tmp % 60;                  // Extraction du nombre de minutes
        tmp = Math.floor((tmp-this.diff.min)/60);  // Nombre d'heures (entières)
        this.diff.hour = tmp % 24;                 // Extraction du nombre d'heures
        tmp = Math.floor((tmp-this.diff.hour)/24); // Nombre de jours restants
        this.diff.day = tmp;
    },

    /**
     * Fonction appelé lorsque le compteur est à zero
     */
    finish: function()
    {
        //Arret du timer
        clearInterval(this.intervalId);

        if (typeof(this.options.callback) === 'function') {
            // Appel de la fonction callback
            this.options.callback.call();
            // TODO
            // does not work with reload() callback function
        }
    },

    /**
     * Ajoute des secondes à une date
     *
     * @param {Date} d
     * @param {Integer} second
     * @returns {Date}
     */
    addSecondToDate: function(d, second)
    {
        var s = d.getSeconds();
        return d.setSeconds(s+second);
    }

};


/**
 * Initialisation du countdown dans l'element DOM sans jQueyr
 * @param id                String      id de l'element DOM
 * @param targetTime        Date        fin du compte a rebour
 * @param callback          Function    Fonction à appler en fin de compte a rebour
 * @param startDatetime     Date()      Definit la date actuelle (le decompte va de startDatetime à targetTime
 */
var initCountDown = function(id, targetTime, callback, startDatetime)
{
    var options = {
        targetTime: targetTime,
        callback: callback,
        startDatetime: startDatetime
    };
    countdownManager.initByClone(id, options);
};

/**
 * Clone un obj JS quelconque
 * @param obj
 *
 * @returns {{}}
 */
var clone = function(obj) 
{
	var target = {};
	for (var i in obj) 
	{
		if (obj.hasOwnProperty(i)) 
		{
			target[i] = obj[i];
		}
	}
	return target;
};

/**
 * Override des fonctions native de timers JS
 * Active la transmition du this
 */
var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

/**
 * Enable the passage of the 'this' object through the JavaScript setTimeout
 * @param vCallback
 * @param nDelay
 * @returns {number}
 */
window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */)
{
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

/**
 * Enable the passage of the 'this' object through the JavaScript setInterval
 * @param vCallback
 * @param nDelay
 * @returns {number}
 */
window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */)
{
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

//Transformation de l'objet en plugin jQuery
if ( typeof jQuery !== "undefined" ) {

    if ( typeof Object.create !== "function" ) {
        /**
         * Object.create support test, and fallback for browsers without it
         * @param o
         * @returns {Object.F}
         */
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    /**
     * Fonction de création de plugin jQuery a partir d'un objet
     * @param name
     * @param object
     */
    $.plugin = function( name, object ) {
        $.fn[name] = function( options ) {
            return this.each(function() {
                if ( ! $.data( this, name ) ) {
                    $.data( this, name, Object.create(object).init(
                        options, this ) );
                }
            });
        };
    };

    //Définition du plugin
    $.plugin('countdownManager', countdownManager);
}