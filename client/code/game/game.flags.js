'use strict'
/* global $game */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    flags.js

    - Instantiates a Flagger class on the main $game object to manage
      game state flags.

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var Flagger = require('/class.flagger')

// Create an instance of the Flagger class for the main $game object.
$game.flags = (function () {
  return new Flagger()
}())
