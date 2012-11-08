'/filters/(.*)', 'filters',

class filters:
	def GET(self, collection):
		common_filters = ["performer", "instrument", "composer", "lyricist",\
		"form", "recording", "release"]
		andalusian_filters = []
		carnatic_filters = ["raaga", "taala"]
		hindustani_filters = ["raag", "taal", "lay", "gharana"]
		ottoman_filters = ["makam", "usul"]
		web.header('Content-Type', 'application/json')
		if collection == "andalusian":
			return json.dumps({"common":common_filters, \
			"specific":andalusian_filters})
			#return self.dir_contents(self.path_collection+"Andalusian/audio")
		elif collection == "ottoman":
			return json.dumps({"common":common_filters, \
			"specific":ottoman_filters})
			#return self.dir_contents(self.path_collection+"Ottoman/audio")
		elif collection == "carnatic":
			return json.dumps({"common":common_filters, \
			"specific":carnatic_filters})
			#return self.dir_contents(self.path_collection+"Carnatic/audio")
		elif collection == "hindustani":
			return json.dumps({"common":common_filters, \
			"specific":hindustani_filters})
			#return self.dir_contents(self.path_collection+"Hindustani/audio")
		elif collection == "all":
			return json.dumps({"common":common_filters})

