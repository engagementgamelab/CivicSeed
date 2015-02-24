'use strict'
/* global ss, $, $game */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    input.js

    - Handles on-screen buttons, HUD elements, generic gameboard
      interactions, keypresses, and codes/effects triggered in chat.
    - Also handles various UI interactions, like show / hide / toggle of
      overlays.

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var $input = module.exports = (function () {
  var $body

  // Remember if any keys are held down, to prevent
  // repeated firings of certain keys
  var keysHeld = {}

  function isKeyInputAccepted () {
    // TODO: There may be other conditions to test whether keypad input should be accepted.
    return (!$('input, textarea').is(':focus')) ? true : false
  }

  function isKeyHeldDown (keycode) {
    return (keycode in keysHeld)
  }

  function recordHeldKey (keycode) {
    if (keycode) {
      keysHeld[keycode] = true
    }
  }

  function deleteHeldKey (keycode) {
    delete keysHeld[keycode]
  }

  // Decide if we should or should not let buttons be clicked based on state
  function isNewActionAllowed () {
    // Check all the game states (if windows are open ,in transit, etc.) to begin a new action
    return (
      $game.running &&
      !$game.flags.check('screen-transition') &&
      !$game.flags.check('botanist-chatting') &&
      !$game.flags.check('visible-seedventory') &&
      !$game.flags.check('visible-skinventory') &&
      !$game.flags.check('visible-help') &&
      !$game.flags.check('visible-progress') &&
      !$game.flags.check('visible-resource-overlay') &&
      !$game.flags.check('visible-botanist-overlay') &&
      !$game.flags.check('visible-boss-overlay') &&
      !$game.flags.check('playing-cutscene')
    ) ? true : false
  }

  // Inputs for game activities
  function trigger (input) {
    switch (input) {
      case 'FOREST':
        if ($game.flags.check('teleport-forest')) {
          outfitLog('Teleporting to ' + $game.world.northwest.name + '!')
          $game.$player.beam({x: 15, y: 22})
        } else {
          return false
        }
        break
      case 'TOWN':
        if ($game.flags.check('teleport-town')) {
          outfitLog('Teleporting to ' + $game.world.northeast.name + '!')
          $game.$player.beam({x: 98, y: 31})
        } else {
          return false
        }
        break
      case 'RANCH':
        if ($game.flags.check('teleport-ranch')) {
          outfitLog('Teleporting to ' + $game.world.southeast.name + '!')
          $game.$player.beam({x: 131, y: 96})
        } else {
          return false
        }
        break
      case 'PORT':
        if ($game.flags.check('teleport-port')) {
          outfitLog('Teleporting to ' + $game.world.southwest.name + '!')
          $game.$player.beam({x: 33, y: 99})
        } else {
          return false
        }
        break
      case 'kazaam':
        outfitLog('Starting collaborative challenge.')
        ss.rpc('game.player.collaborativeChallenge', function (err) {
          // Not implemented.
          if (err) {
            $game.log('Whoops: you came alone, you get no bone(us).')
          }
        })
        break
      default:
        return false
    }
  }

  // Cheats only
  function cheat (input) {
    switch (input.toLowerCase()) {
      case 'beam me up scotty':
      case 'beam me up, Scotty!':   // Legacy cheat with punctuation
        cheatLog('Teleporting to botanist.')
        $game.$player.beam({x: 70, y: 74})
        break
      case 'show me the money':
        cheatLog('Adding 50 seeds.')
        $game.$player.addSeeds('regular', 50)
        break
      case 'like one of your french girls':
        cheatLog('Adding 50 paint seeds.')
        $game.$player.addSeeds('draw', 50)
        break
      case 'loki':
        cheatLog('Debug seed amount.')
        $game.$player.setSeeds('regular', 0)
        $game.$player.setSeeds('draw', 3)
        break
      case 'ding me':
        cheatLog('Leveling up!')
        $game.$player.nextLevel()
        break
      case 'suit alors':
        cheatLog('All suits unlocked!')
        var sets = $game.$skins.getSetsList()
        for (var i in sets) {
          $game.$skins.unlockSkin(sets[i])
        }
        break
      case 'birthday suit':
        cheatLog('All suits removed!')
        $game.$skins.resetSkinventory()
        break
      case 'pleasantville':
        cheatLog('Welcome to Pleasantville!')
        $game.bossModeUnlocked = true
        $game.flags.set('boss-mode-unlocked')
        $game.flags.set('boss-mode-ready')
        $game.$player.currentLevel = 4
        $game.toBossLevel()
        break
      default:
        return false
    }
  }

  function log (color, tag, message) {
    $game.log('<span class="color-' + color + '">[' + tag + ']</span>' + ' ' + message)
  }

  function outfitLog (message) {
    log('lightpurple', 'Outfit effect', message)
  }

  function cheatLog (message) {
    log('yellow', 'Cheat code activated', message)
  }

  return {
    init: function () {
      $body = $(document.body)

      /* * * * * * * *       GENERIC GAMEBOARD INTERACTION       * * * * * * * */

      // Update cursor on mouse move
      $body.on('mousemove', '#gameboard', function (e) {
        if (!$game.flags.check('screen-transition') && $game.running) {
          $game.$mouse.onMove({
            event: e,
            x: e.pageX,
            y: e.pageY,
            offX: this.offsetLeft,
            offY: this.offsetTop
          })
        }
      })

      // Decide what to do on mouse click
      $body.on('click', '#gameboard', function (e) {
        if (isNewActionAllowed() === true) {
          $game.$mouse.onClick({
            event: e,
            x: e.pageX,
            y: e.pageY,
            offX: this.offsetLeft,
            offY: this.offsetTop
          })
        }
      })

      /* * * * * * * *                HUD BUTTONS                * * * * * * * */

      // Prevent clicking of any HUD button if resource or botanist overlays are shown
      $body.on('click', '.hud-button', function (e) {
        if ($game.flags.check('visible-resource-overlay') || $game.flags.check('visible-botanist-overlay')) {
          e.stopImmediatePropagation()
        }
      })

      // Toggle display of Inventory
      $body.on('click', '.hud-inventory, #inventory button', function () {
        $game.inventory.toggle()
      })

      // Toggle display of Changing Room (skinventory)
      $body.on('click', '.hud-skinventory', function () {
        $input.toggleSkinventory()
      })

      // Toggle display of Seed inventory (seedventory)
      $body.on('click', '.hud-seed', function () {
        $input.toggleSeedMode()
      })

      // Toggle display of Game log
      $body.on('click', '.hud-log', function () {
        $input.toggleGameLog()
      })

      // Toggle display of Progress window
      $body.on('click', '.hud-progress', function () {
        $input.toggleProgress()
      })

      // Toggle Audio on/off
      $body.on('click', '.hud-mute', function () {
        $input.toggleMute()
      })

      // Toggle display of Help window
      $body.on('click', '.hud-help', function () {
        $input.toggleHelp()
      })

      // Display a tooltip when player hovers over HUD controls
      $body.on('mouseenter', '.hud-button a', function () {
        $(this).tooltip('show')
      })

      // When player clicks a highlighted HUD button, remove the highlight
      $body.on('click', '.hud-button-highlight', function () {
        $input.unhighlightHUDButton(this)
      })

      /* * * * * * * *      SEEDVENTORY WINDOW INTERACTIONS      * * * * * * * */

      // When a seed button is clicked, clear all seed selected (highlight) classes
      $body.on('click', '#seedventory .seed', function () {
        $('#seedventory .seed').removeClass('selected')
      })

      // Select regular seed
      $body.on('click', '#seedventory .regular-button', function () {
        $('.regular-button').addClass('selected')
        $game.$player.startSeeding('regular')
      })

      // Select draw seed
      $body.on('click', '#seedventory .draw-button', function () {
        $('.draw-button').addClass('selected')

        $game.$player.startSeeding('draw')

        $body.on('mousedown touchstart', '#gameboard', function () {
          $game.$player.drawFirstSeed()
          $game.flags.set('draw-mode')
        })
        $body.on('mouseup touchend', '#gameboard', function () {
          $game.flags.unset('draw-mode')
        })
      })

      // Close Seed inventory
      $body.on('click', '#seedventory .close-button', function () {
        $input.endSeedMode()
      })

      /* * * * * * * *       PROGRESS WINDOW INTERACTIONS        * * * * * * * */

      // You vs Everyone progress map tabs
      $body.on('click', '.tab-you', function () {
        // '.active' class is based on Bootstrap's 'tabbable'
        $('#tab-you-pane').addClass('active')
        $('#tab-everyone-pane').removeClass('active')
      })

      $body.on('click', '.tab-everyone', function () {
        // '.active' class is based on Bootstrap 'tabbable'
        $('#tab-everyone-pane').addClass('active')
        $('#tab-you-pane').removeClass('active')
      })

      // View all player resource answers
      $body.on('click', '.collected-button', function () {
        $('#collected-resources').show()
      })

      // Go back to progress menu from player resource answers
      $body.on('click', '#collected-resources .back-button', function () {
        $('#collected-resources').hide()
      })

      // Close Progress window
      $body.on('click', '#progress-area .close-overlay', function (e) {
        e.preventDefault()
        $input.closeProgress()
        return false
      })

      /* * * * * * * *      SKINVENTORY WINDOW INTERACTIONS      * * * * * * * */

      // Click to equip a new skin part
      $body.on('click', '#skinventory .outer', function () {
        if (!$(this).hasClass('locked')) {
          var name = $(this).data('name')
          var part = $(this).parent().data('part')

          // Set highlight class
          $(this).parent().children().removeClass('equipped')
          $(this).addClass('equipped')

          // Set suit
          $game.$skins.changePlayerSkin(name, part)
        }
      })

      // Close skinventory
      $body.on('click', '#skinventory .close-button', function (e) {
        e.preventDefault()
        $input.closeSkinventory()
        return false
      })

      /* * * * * * * *            HELP WINDOW OVERLAY            * * * * * * * */

      // Close Help window
      $body.on('click', '#help-area a i, #help-area .close-button', function (e) {
        e.preventDefault()
        $input.closeHelp()
        return false
      })

      /* * * * * * * *        RESOURCE WINDOW INTERACTIONS       * * * * * * * *

      NOTE:   Interactions bound to some buttons in the resource overlay are
              programatically bound when needed in resources.js.

       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

      // Close the resource area
      $body.on('click', '#resource-area .close-overlay', function (e) {
        e.preventDefault()
        $game.$resources.hideResource()
        return false
      })

      // Make your comment public
      $body.on('click', '.public-button button', function () {
        $game.$player.makePublic($(this).attr('data-resource'))
        // Toggle state of button
        // TODO: place this presentation logic elsewhere
        // This toggling does not reflect success / error conditions from server
        $(this).parent().removeClass('public-button').addClass('private-button')
        $(this).parent().find('i').removeClass('fa-lock').addClass('fa-unlock-alt')
        $(this).text('Make Private')
      })

      // Make your comment private
      $body.on('click', '.private-button button', function () {
        $game.$player.makePrivate($(this).attr('data-resource'))
        // Toggle state of button
        // TODO: place this presentation logic elsewhere
        // This toggling does not reflect success / error conditions from server
        $(this).parent().removeClass('private-button').addClass('public-button')
        $(this).parent().find('i').removeClass('fa-unlock-alt').addClass('fa-lock')
        $(this).text('Make Public')
      })

      // Pledge a seed to a comment
      $body.on('click', '.pledge-button button', function () {
        var info = {
          id: $(this).attr('data-player'),
          pledger: $game.$player.firstName,
          resourceId: $(this).attr('data-resource')
        }

        var pledges = $game.$player.getPledges()

        if (pledges > 0) {
          ss.rpc('game.player.pledgeSeed', info, function (r) {
            $game.$player.updatePledges(-1)
            $game.$resources.showCheckMessage('Thanks! (they will say). You can seed ' + (pledges - 1) + ' more answers this level.')
            if ($game.flags.check('pledge-reward')) {
              $game.$player.addSeeds('draw', 10)
              outfitLog('You gained 10 paintbrush seeds for seeding another player’s response.')
            }
          })
        } else {
          $game.$resources.showCheckMessage('You cannot seed any more answers this level.')
        }
      })

      /* * * * * * * *       BOTANIST OVERLAY INTERACTIONS       * * * * * * * *

      NOTE:   Interactions bound to buttons in the botanist overlay are
              programatically bound when needed in botanist.js.

       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

      // Close botanist window
      $body.on('click', '#botanist-area .close-overlay', function (e) {
        e.preventDefault()
        $game.$botanist.hideOverlay()
        return false
      })

      /* * * * * * * *        OTHER GAMEBOARD HUD ELEMENTS       * * * * * * * */

      $body.on('click', '#speech-bubble, #inventory, #botanist-area', function (e) {
        // Prevent clicking on interface elements from interacting with gameboard below
        e.stopImmediatePropagation()
      })

      // When scrolling article or log content, prevent page from scrolling also
      $body.on('mouseenter', '.scrollable, .content-box', function () {
        $(this).scroll(function () {
          $('body').css('overflow', 'hidden')
        })
      })
      $body.on('mouseleave', '.scrollable, .content-box', function () {
        $('body').css('overflow', 'auto')
      })

      // Send a chat message when submitted from the chat input field
      $body.on('click', '#chat-submit', function (e) {
        e.preventDefault()
        var el = document.getElementById('chat-input')
        var message = el.value

        // Stop chatting if player has tried to submit a blank message
        if (message === '') {
          el.blur()
          return false
        }

        $game.$audio.playTriggerFx('chatSend')

        // Check for chat triggers (e.g. cheat codes)
        if (trigger(message) === false && cheat(message) === false) {
          $game.$chat.send(message)
        }

        // Reset input box
        el.value = ''
        return true
      })

      $body.on('click', '#game-log', function () {
        $game.$log.clearUnread()
      })

      // Pause menu if we want it
      // This is currently disabled / unimplemented
      // $(window).blur(function (e) {
      //  $game.pause()
      // })

      // $('.unpause').click(function () {
      //  $game.resume()
      // })

      /* * * * * * * *                KEYBINDINGS                * * * * * * * */

      // Clear key from being held, if it is
      $body.keyup(function (e) {
        deleteHeldKey(e.which)

        switch (e.which) {
          case 87:  // 'w'
          case 38:  // 'up arrow', 'numpad 2' (numlock on)
          case 104: // 'numpad 2' (numlock off)
          case 56:  // 'numpad 2' (numlock off/opera)
          case 65:  // 'a'
          case 37:  // 'left arrow', 'numpad 4'
          case 100: // 'numpad 4' (numlock off)
          case 52:  // 'numpad 4' (numlock off/opera)
          case 83:  // 's'
          case 40:  // 'down arrow', 'numpad 8'
          case 98:  // 'numpad 8' (numlock off)
          case 50:  // 'numpad 8' (numlock off/opera)
          case 68:  // 'd'
          case 39:  // 'right arrow', 'numpad 6'
          case 102: // 'numpad 6' (numlock off)
          case 54:  // 'numpad 6' (numlock off/opera)
            e.preventDefault()
            // Any of these, if unheld, immediately stops movement
            $game.$player.moveStop()
            // And then remove scroll prevention
            $('body').css('overflow', 'auto')
            break
          default:
            // Nothing
            break
        }
      })

      $body.keydown(function (e) {
        // If escape is pressed, cancels any current action and returns to default gameboard view
        if (e.which === 27) {
          $input.resetUI()
        }

        // Allow keyboard inputs only when gameboard is active.
        if (!isNewActionAllowed()) return
        if (!isKeyInputAccepted()) return

        // Refuse inputs if Ctrl or Command is pressed so that the game doesn't overwrite other system/client command keys
        // This does not cover Mac's fn' key
        if (e.ctrlKey === true || e.metaKey === true || e.altKey === true) return

        // Attach keys to actions
        switch (e.which) {
          // **** MOVEMENT ****
          // Each movement event has .preventDefault() to prevent it from scrolling browser window
          case 87:  // 'w'
          case 38:  // 'up arrow', 'numpad 2' (numlock on)
          case 104: // 'numpad 2' (numlock off)
          case 56:  // 'numpad 2' (numlock off/opera)
            // Move player character up.
            e.preventDefault()
            // Disallow event from firing repeatedly on hold
            if (!isKeyHeldDown(e.which)) {
              $game.$player.moveStraight('up')
              recordHeldKey(e.which)
              // Prevent window scroll
              $('body').css('overflow', 'hidden')
            }
            break
          case 65:  // 'a'
          case 37:  // 'left arrow', 'numpad 4'
          case 100: // 'numpad 4' (numlock off)
          case 52:  // 'numpad 4' (numlock off/opera)
            // Move player character to the left.
            e.preventDefault()
            // Disallow event from firing repeatedly on hold
            if (!isKeyHeldDown(e.which)) {
              $game.$player.moveStraight('left')
              recordHeldKey(e.which)
              // Prevent window scroll
              $('body').css('overflow', 'hidden')
            }
            break
          case 83:  // 's'
          case 40:  // 'down arrow', 'numpad 8'
          case 98:  // 'numpad 8' (numlock off)
          case 50:  // 'numpad 8' (numlock off/opera)
            // Move player character down.
            e.preventDefault()
            // Disallow event from firing repeatedly on hold
            if (!isKeyHeldDown(e.which)) {
              $game.$player.moveStraight('down')
              recordHeldKey(e.which)
              // Prevent window scroll
              $('body').css('overflow', 'hidden')
            }
            break
          case 68:  // 'd'
          case 39:  // 'right arrow', 'numpad 6'
          case 102: // 'numpad 6' (numlock off)
          case 54:  // 'numpad 6' (numlock off/opera)
            // Move player character to the right.
            e.preventDefault()
            // Disallow event from firing repeatedly on hold
            if (!isKeyHeldDown(e.which)) {
              $game.$player.moveStraight('right')
              recordHeldKey(e.which)
              // Prevent window scroll
              $('body').css('overflow', 'hidden')
            }
            break
          // **** CHAT ****
          case 84:  // 't'
          case 13:  // 'enter'
            // Focus chat input field.
            e.preventDefault() // prevent 't' from appearing in the input.
            $input.focusChatInput()
            break
          // **** DISPLAY HUD OVERLAYS & WINDOWS ****
          case 73:  // 'i'
            // Display inventory overlay.
            $game.inventory.toggle()
            break
          case 69:  // 'e'
            // Seedventory
            $input.toggleSeedMode()
            break
          case 77:  // 'm'
            // Toggles minimap.
            // Currently disabled because there's currently no way for the player to know how to get this back in the UI.
            // $input.toggleMinimap()
            break
          case 67:  // 'c'
            // Changing room
            $input.toggleSkinventory()
            break
          case 76:  // 'l'
            // Game log
            $input.toggleGameLog()
            break
          case 80:  // 'p'
            // Progress
            $input.toggleProgress()
            break
          case 86:  // 'v'
            // Mute audio
            $input.toggleMute()
            break
          case 72:  // 'h'
          case 191: // 'question mark' (?)
            // Help
            $input.toggleHelp()
            break
          // Default switch: all other key presses, no action.
          default:
            break
        }
      })
    },

    focusChatInput: function () {
      document.getElementById('chat-input').focus()
    },

    // Toggle minimap
    // Currently disabled in UI.
    // TODO: Consider moving logic to $game.minimap module
    toggleMinimap: function () {
      if ($game.flags.check('first-time') === true) return // Disables if it's player's first time in the game.
      $('.minimap').toggle()
    },

    // Toggles Seed Mode.
    toggleSeedMode: function () {
      if ($game.$player.seedMode === true || $game.flags.check('seed-mode') === true) {
        $input.endSeedMode()
      } else {
        $input.startSeedMode()
      }
    },

    startSeedMode: function () {
      var seeds = $game.$player.getSeeds()

      $input.resetUI()

      $game.$player.seedMode = true
      $game.flags.set('seed-mode')
      $input.activeHUDButton('.hud-seed')

      // Force update of mouse cursor
      $game.$mouse.updateCursor()

      // Special controls for boss mode
      if ($game.flags.check('boss-mode')) {
        $game.$boss.startSeedMode()
      } else if (seeds.draw > 0) {
        // If player has multiple types of seeds, open up the seed inventory
        $input.openSeedventory(seeds)
      } else if (seeds.regular > 0) {
        // Otherwise, go straight to regular seed planting mode
        $game.$player.seedPlanting = true
        $game.$player.seedMode = 'regular'
        $game.alert('Click anywhere to plant a seed and watch color bloom there')
      } else {
        // No seeds, cancel out of seed mode.
        $game.alert('You have no seeds!')
        $game.$input.endSeedMode()
      }
    },

    endSeedMode: function () {
      $game.$player.seedMode = false
      $game.flags.unset('seed-mode')
      if ($game.flags.check('visible-seedventory') === true) {
        $input.closeSeedventory()
      }
      document.getElementById('graffiti').style.display = 'none'
      $body.off('mousedown touchend', '#gameboard')
      $body.off('mouseup touchend', '#gameboard')
      $game.flags.unset('draw-mode')
      $game.$player.seedPlanting = false
      $input.inactiveHUDButton('.hud-seed')

      // Force update of mouse cursor
      $game.$mouse.updateCursor()

      $game.$player.saveMapImage()
      $game.$player.saveSeeds()
    },

    openSeedventory: function (seeds) {
      $game.alert('Choose a seed to plant')
      $('#seedventory').slideDown(300, function () {
        if (seeds.regular > 0) $('.regular-button').addClass('active')
        if (seeds.draw > 0) $('.draw-button').addClass('active')
        $game.flags.set('visible-seedventory')
      })
    },

    closeSeedventory: function () {
      $('#seedventory').slideUp(300, function () {
        $game.flags.unset('visible-seedventory')
      })
    },

    toggleSkinventory: function () {
      return ($game.flags.check('visible-skinventory') === true) ? $input.closeSkinventory() : $input.openSkinventory()
    },

    openSkinventory: function () {
      $input.resetUI()
      $input.activeHUDButton('.hud-skinventory')
      $game.flags.set('visible-skinventory')
      $('#skinventory').show()

      // Reset badge count
      $game.setBadgeCount('.hud-skinventory', 0)
    },

    closeSkinventory: function () {
      $game.flags.unset('visible-skinventory')
      $input.inactiveHUDButton('.hud-skinventory')
      $('#skinventory').hide()
    },

    toggleGameLog: function () {
      $input.resetUI()
      $game.$log.clearUnread()

      if ($('#game-log').is(':visible')) {
        $input.hideGameLog()
        $input.showGameLogOverlay()
      } else {
        $input.hideGameLogOverlay()
        $input.showGameLog()
      }
    },

    showGameLogOverlay: function () {
      $('#game-log-overlay').fadeIn(200)

      // Display a highlight HUD button for this
      $input.activeHUDButton('.hud-log')
    },

    hideGameLogOverlay: function () {
      $('#game-log-overlay').hide()
      $input.inactiveHUDButton('.hud-log')
    },

    showGameLog: function () {
      var height = $(window).height()
      $('html, body').stop().animate({
        scrollTop: height
      }, 250)
      $('#game-log').show()
    },

    hideGameLog: function () {
      $('#game-log').hide()
    },

    toggleProgress: function () {
      return ($game.flags.check('visible-progress') === true) ? $input.closeProgress() : $input.openProgress()
    },

    openProgress: function () {
      $input.resetUI()
      $input.activeHUDButton('.hud-progress')
      $game.flags.set('visible-progress')
      $game.updateProgressOverlay()
      $('#progress-area').show()
    },

    closeProgress: function () {
      $game.flags.unset('visible-progress')
      $input.inactiveHUDButton('.hud-progress')
      $('#progress-area').hide()
    },

    toggleHelp: function () {
      return ($game.flags.check('visible-help') === true) ? $input.closeHelp() : $input.openHelp()
    },

    openHelp: function () {
      $input.resetUI()
      $input.activeHUDButton('.hud-help')
      $game.flags.set('visible-help')
      $('#help-area').show()
    },

    closeHelp: function () {
      $game.flags.unset('visible-help')
      $input.inactiveHUDButton('.hud-help')
      $('#help-area').hide()
    },

    toggleMute: function () {
      return ($game.$audio.toggleMute() === true) ? $input.muteAudio() : $input.unmuteAudio()
    },

    muteAudio: function () {
      $('.hud-mute .fa').removeClass('fa-volume-up').addClass('fa-volume-off')
    },

    unmuteAudio: function () {
      $('.hud-mute .fa').removeClass('fa-volume-off').addClass('fa-volume-up')
    },

    // Add a highlight to a HUD button
    highlightHUDButton: function (target) {
      $('#hud .hud-button').removeClass('hud-button-highlight') // Removes all previous HUD highlights
      $(target).addClass('hud-button-highlight')
    },

    // Remove a highlight to a HUD button
    unhighlightHUDButton: function (target) {
      $(target).removeClass('hud-button-highlight')
    },

    // Highlight an active HUD button
    activeHUDButton: function (target) {
      $('#hud .hud-button').removeClass('hud-button-active') // Removes all previous HUD highlights
      $(target).addClass('hud-button-active')
    },

    // Remove highlight to active HUD button
    inactiveHUDButton: function (target) {
      $(target).removeClass('hud-button-active')
    },

    // Clears UI and sets everything into the most defaultest mode we can
    resetUI: function () {
      // Close any overlays
      $game.inventory.close()
      $input.closeSkinventory()
      $input.closeProgress()
      $input.closeHelp()
      $input.endSeedMode()

      // Also simultaneously cancel out of resources, botanist, and speechbubbles.
      $game.$npc.hideSpeechBubble()
      if ($game.flags.check('botanist-chatting') || $game.flags.check('visible-botanist-overlay')) {
        $game.$botanist.hideOverlay()
      }

      // Unfocus chat input box
      document.getElementById('chat-input').blur()

      // TODO: Set cursor to walk action
    }
  }
}())
