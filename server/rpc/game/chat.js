// Server-side Code
var service, chatModel;

// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {

	req.use('session');
	// req.use('debug');

	return {

		init: function() {
			service = ss.service;
			console.log('rpc.chat.initChat');
			chatModel = service.useModel('chat', 'ss');
		},

		sendMessage: function(data) {
			// console.log('rpc.chat.sendMessage: ', data);
			if (data.msg && data.msg.length > 0) {         // Check for blank messages
				var logChat = {
					who: data.name,
					id: data.id,
					what: data.log,
					when: Date.now(),
					instanceName: data.instanceName
				};
				chatModel.create(logChat, function(err, suc) {
					if(err) {
						console.log('error saving chat: ', err);
						return res(false);
					}
					else {
						ss.publish.channel(req.session.game.instanceName, 'ss-newMessage', {message: data.msg, id: data.id, name: data.name});     // Broadcast the message to everyone
						return res(true);                          // Confirm it was sent to the originating client
					}
				});
			}
			else {
				return res(false);
			}
		}

	};

};