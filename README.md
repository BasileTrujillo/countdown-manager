# README #

Countdown Manager tool 
Class compatible jQuery et Javascript natif 

### What is this repository for? ###

* Permet de générer dans un élément DOM un compte à rebours visuel avec un callback de fin
* Gère les jours, heures, minutes, secondes
* Ex: 1j 1h 9m 57s
* Version 0.9

### How do I get set up? ###

* Include with or without jQuery
This tools is able to detect jQuery and convert itselft to a jQuery plugin.

```
#!html
<!-- Optional jQuery include -->
<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/X.X.X/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="local/jquery-X.X.X.min.js"></script>')</script>

<!-- Include countdown-manager.js -->
<script type="text/javascript" src="countdown-manager.js"></script>
```

* Configuration

```
#!javascript
//Datetime cible
var targetTime = new Date('2015-08-14T11:24:00');
        
//Datetime de départ
var targetTime = new Date('2015-08-13T11:24:00');

//Liste des options
var options = {
    targetTime: targetTime,   //Target date
    callback: foo,            //Callback function
    startDatetime: targetTime //Optional start date
};
```

* Usage

```
#!javascript
/**
 * Native usage (without jQuery)
 */
var id = 'bar';
countdownManager.initByClone(id, options);

/**
 * jQuery way to use
 */
$('#'+id).countdownManager(options);
```

### Who do I talk to? ###

* Creator : Basile Trujillo
* Contributor : Seritech Team