'use strict'

exports.actions = function (req, res, ss) {
  req.use('session')

  var UserModel = ss.service.db.model('User')
  var GameModel = ss.service.db.model('Game')

  return {

    getProfileInformation: function (playerId) {
      // playerId could be what's in either profileLink (just the profile Id random char string)
      // or a custom one that's set by the user.

      UserModel.findOne({ profileLink: playerId }, function (err, user) {
        if (err) {
          console.log(err)
          res({ firstName: false })
        } else if (user) {
          var profileInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            school: user.school,
            resume: user.game.resume,
            resumeFeedback: user.game.resumeFeedback,
            gameStarted: user.gameStarted,
            profilePublic: user.profilePublic,
            profileUnlocked: user.profileUnlocked,
            profileSetup: user.profileSetup,
            colorMap: user.game.colorMap || false,
            email: user.email,

            // TEMP: Get resume question answers stored in resources
            resources: user.game.resources,
            profile: user.profile
          }

          GameModel
            .where('instanceName').equals(user.game.instanceName)
            .findOne(function (err, game) {
              if (err) {
                res(false)
              } else if (game) {
                profileInfo.active = game.active
                res(profileInfo)
              }
            })
        } else {
          res({ firstName: false })
        }
      })
    },

    getAllProfiles: function () {
      // Get all profiles from players who have started the game
      // In the all-profiles page, we will only display profiles
      // that are public, but we retrieve the others so that admin
      // can view non-public profiles in progress.

      // Also, reject profiles from the 'test' games of Demo and Boss
      UserModel.find({
        role: 'actor',
        gameStarted: true,
        'game.instanceName': {
          '$not': /(demo|boss)/
        }
      }).sort({
        firstName: 1,
        lastName: 1
      }).exec(function (err, users) {
        if (err) {
          console.log(err)
          res(false)
        } else {
          // For flexibility, return all user data
          res(users)
        }
      })
    },

    updateResume: function (info) {
      UserModel.findById(info.id, function (err, user) {
        if (err) {
          console.log(err)
          res(false)
        } else if (user) {
          user.game.resume = info.resume
          user.save(function (err, okay) {
            if (err) {
              console.log('error saving')
              res(false)
            } else {
              res(true)
            }
          })
        }
      })
    },

    setPublic: function (info) {
      UserModel.findById(info.id, function (err, user) {
        if (err) {
          console.log(err)
          res(false)
        } else if (user) {
          user.profilePublic = info.changeTo
          user.save(function (err, okay) {
            if (err) {
              console.log('error saving')
              res(false)
            } else {
              res(true)
            }
          })
        }
      })
    },

    // Find the user and update their mugshot URL
    // Called after a successful upload to S3, with the new path to the file
    // TODO: This is very similar to other functions; make a generic update function
    updateProfileMugshotURL: function (playerId, data) {
      UserModel.findById(playerId, function (err, user) {
        if (err) {
          console.log(err)
          res(false)
        } else if (user) {
          user.game.profile.mugshotURL = data.mugshotURL
          user.save(function (err, okay) {
            if (err) {
              console.log('error saving')
              res(false)
            } else {
              res(true)
            }
          })
        }
      })
    }

  }
}
