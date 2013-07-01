module.exports.global = {
	id: 99999,
	x: 71,
	y: 74,
	name: 'The Botanist',
	spriteMap: [{
		x: 0,
		y: 0
	}],
	dialog: [{
		instructions: ['Thanks for coming to lend a hand today. As you can see, things are pretty gray. You’ll fix that by planting color seeds.', 'Once you’re done talking to me, you’ll have a seed! Plant it by clicking on the leaf icon at the bottom of your display. Try planting the seed now, then come back and talk to me.'],
		riddle: {
			sonnet: 'The first Mega Seed needs four pieces to complete... all of them about YOU.<br>One about why you want to engage<br>One about what you\'re trying to achieve<br>One about what makes you who you are, your identity<br>One about the important values that gude you.',
			// sonnet: 'First, you must find a way<br>to tell me <b>what you brought</b> today<br>and how <b>your future</b> and <b>your past</b><br>combine to form a mold you cast.<br>How does pity become solidarity?<br>One hint: <b>Walk with humility.</b>',
			prompts: ['Good work! But you need to plant a lot more. To fully color the world, you must work together with your peers and others in our community. Click the computer-screen icon on your display at any time to see your progress! When it reaches 100%, the world will be saved. Want find out how to get more seeds?', 'I think you have enough pieces to solve the enigma! Want to try?'],
			response: 'That’s right! Great work! Now you’re ready to move to level 2. I’ve given you some Mega Seeds that cover more area. Now, when you enter seed-planting mode, you will have the ability to plant a Mega or normal seed.'
		},
		hint: ['You must go to the northwest and talk to some people to collect the puzzle pieces. You can see how many pieces are available by looking at the empty spaces in your inventory.', 'Hmmm... It looks like you don\'t have the right pieces to solve the enigma! Go back into Brightwood Forest, in the northwest section of the world, and talk to some more people.']
	}, {
		instructions: ['To answer the second section of the enigma, journey to the town of Calliope, located in the northeast section of the world.','Level 2, Expanding Outward, is about exploring the concepts of community partnerships and specifics about Tufts host communities.','Now that you understand the importance of looking inward, it is important to learn about the basics of community engagement and discover as much as possible about the communities in which you will serve and learn.'],
		riddle: {
			sonnet: 'Second, what do you gain the more you give, <br>and how can you give if you are to gain?<br>Who out there can explain <br>what communities need and <b>what they contain</b>?<br>Do you see <b>assets</b> or do you see need <br>when you look at <b>partners</b> in the <b>community</b>?<br><b>Expand your view</b><br>and tell me too, <br>who can see it better than you?',
			prompts: ['Here, take a look at the next part of the enigma', 'It looks like you have enough pieces to solve the enigma, ready to try?'],
			response: 'Great work! Now you’re ready to move to level 3. Your Mega Seeds are now even more powerful!'
		},
		hint: ['You must go to the northeast and talk to some people to collect the puzzle pieces. You can see how many pieces are available by looking at the empty spaces in your inventory.', 'Hmmm... It looks like you don\'t have the right pieces to solve the enigma! Go back into the town of Calliope, in the northeast section of the world, and talk to some more people.']
	}, {
		instructions: ['To answer the third section of the enigma, journey to the Ranch, located in the southeast section of the world.','Working Together, is about feflecting on intercultural, social, and socio-economic identities, along with developing practical skills and common goals.','Working together successfully is dependent on building mutual trust and understanding, developing mutually beneficial goals, and having the skills needed for project implementation.'],
		riddle: {
			sonnet: 'You know <b>how you got here</b> and so do I<br>can you forget it? Should you try?<br>How do <b>people from here and there</b><br>build a dream that they <b>both share</b><br>When is a <b>goal</b> obtainable? <br><b>Responsibility</b> / <b>maintainable</b>? <br>Are your thoughts explainable? <br>Is what we teach retainable?',
			prompts: ['Here, take a look at the next part of the enigma', 'It looks like you have enough pieces to solve the enigma, ready to try?'],
			response: 'Great work! Now you’re ready to move to level 4. Your Mega Seeds have become more powerful than ever.'
		},
		hint: ['You must go to the southeast and talk to some people to collect the puzzle pieces. You can see how many pieces are available by looking at the empty spaces in your inventory.', 'Hmmm... It looks like you don\'t have the right pieces to solve the enigma! Go back to the Ranch, in the southeast section of the world, and talk to some more people.']
	}, {
		instructions: ['To answer the fourth section of the enigma, journey to the Port District, located in the southwest section of the world.','Level 4,  Looking Forward, is about building upon your experience, evaluating it, sustaining it, and connecting with others.','Even though you have not yet begun, it is useful to think about how you will build upon your community engagement experience to be an even more effective active citizen and create lasting positive change.'],
		riddle: {
			sonnet: 'When the seed is fertile, who should sow it?<br>A challenge, a solution, <b>who should own it</b>?<br>Will you grow connections,<br>become a <b>leader</b> by <b>reflection</b>,<br> be inspired, plant roots, or <b>discover direction?</b><br>The last question is the hardest of all,<br>so look into your crystal ball.<br>Will <b>your mark</b> be great or small?<br>Will we be glad you came at all?',
			prompts: ['Here, take a look at the next part of the enigma', 'It looks like you have enough pieces to solve the enigma, ready to try?'],
			response: 'You did it! You solved the final piece of the enigma!'
		},
		hint: ['You must go to the southwest and talk to some people to collect the puzzle pieces. You can see how many pieces are available by looking at the empty spaces in your inventory.', 'Hmmm... It looks like you don\'t have the right pieces to solve the enigma! Go back to the Port District, in the southwest section of the world, and talk to some more people.']
	}, {
		instructions: ['Welcome to the game. I am your humble botanist.', 'We are a simple land, with creatures like you and me.', 'However, we have a constant problem where our world becomes colorless. We love color....', 'Solve my riddles and I will give you seeds to plant color.', 'LEAVE ME ALONE, ROARRRRRRR!!!!'],
		riddle: {
			sonnet: 'Why and how this garden grows<br>is something you may never know --<br>that is unless you first uncover<br>how we work with one another.<br>So I\'ll tell you how this starts:<br> with a riddle in four parts.',
			prompts: ['Wanna see it?  Do you?', 'Wanna solve it? Think you are ready?'],
			response: 'ya'
		},
		hint: ['you need to gather more resources', 'you need to go talk to some citizens']
	}],
	finale: {
		videos: ['video to come'],
		explanations: ['explanation to come']
	},
	tangram: [{
		answer: [{
			id: 'correct1',
			x: 430,
			y: 220
		}, {
			id: 'correct2',
			x: 470,
			y: 50
		}, {
			id: 'correct3',
			x: 470,
			y: 150
		}, {
			id: 'correct4',
			x: 470,
			y: 50
		}]
	}, {
		answer: [{
			id: 'correct1',
			x: 500,
			y: 240
		}, {
			id: 'correct2',
			x: 320,
			y: 160
		}, {
			id: 'correct3',
			x: 320,
			y: 360
		}, {
			id: 'correct4',
			x: 620,
			y: 360
		}, {
			id: 'correct5',
			x: 420,
			y: 120
		}]
	}, {
		answer: [{
			id: 'correct1',
			x: 420,
			y: 110
		}, {
			id: 'correct2',
			x: 320,
			y: 110
		}, {
			id: 'correct3',
			x: 320,
			y: 210
		}, {
			id: 'correct4',
			x: 380,
			y: 210
		}, {
			id: 'correct5',
			x: 480,
			y: 280
		}, {
			id: 'correct6',
			x: 320,
			y: 110
		}]
	}, {
		answer: [{
			id: 'correct1',
			x: 470,
			y: 140
		}, {
			id: 'correct2',
			x: 470,
			y: 360
		}, {
			id: 'correct3',
			x: 470,
			y: 180
		}, {
			id: 'correct4',
			x: 470,
			y: 180
		}, {
			id: 'correct5',
			x: 470,
			y: 220
		}]
	}]
};