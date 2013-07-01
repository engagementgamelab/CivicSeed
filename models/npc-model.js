module.exports = function(mongoose, db, Schema, ObjectId) {

	var npcSchema = new Schema({
		id: Number,
		index: Number,
		name: String,
		level: Number,
		sprite: Number,
		isHolding: Boolean,
		dialog: {
			smalltalk: [String],
			prompts: [String]
		},
		dependsOn: [Number],
		resource: {
			url: String,
			tagline: String,
			question: String,
			questionType: String,
			requiredLength: Number,
			possibleAnswers: [String],
			answer: String,
			feedbackWrong: String,
			feedbackRight: String,
			shape: String
		}
	});

	var NpcModel = db.model('npc', npcSchema, 'npcs');

	return NpcModel;

};