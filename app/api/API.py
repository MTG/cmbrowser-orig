# -*- coding: utf-8 -*-

import web
import json
import sys, re, os
import datetime
#sys.path.append("/home/msordo/CompMusic/musicbrowser/app")
sys.path.append("/compmusicweb/compmusic/musicbrowser/app/db")
#import db.DAO as DAO
import DAO

debug = True
relative_path = "/CompMusicBrowser/"
render = web.template.render('templates/')
uuid_regexp = "[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}"
specific_filters = ["raaga", "taala"] + ["raga", "tala", "laya", "gharana"] + ["makam", "usul"]
common_filters = ["performer", "instrument", "composer", "lyricist", "recording", "release", "work"]
all_filters = common_filters + specific_filters + ["collection"]

urls = (
	'/performers/(.*)', 'performers',
	'/performers', 'performers',
	'/performer/(.*)', 'performer',
	'/composers/(.*)', 'composers',
	'/composers', 'composers',
	'/composer/(.*)', 'composer',
	'/lyricists/(.*)', 'lyricists',
	'/lyricists', 'lyricists',
	'/lyricist/(.*)', 'lyricist',
	'/releases/(.*)', 'releases',
	'/releases', 'releases',
	'/release/(.*)', 'release',
	'/recordings/(.*)', 'recordings',
	'/recordings', 'recordings',
	'/recording/(.*)', 'recording',
	'/instruments/(.*)', 'instruments',
	'/instruments', 'instruments',
	'/instrument/(.*)', 'instrument',
	'/works/(.*)', 'works',
	'/works', 'works',
	'/filters/(.*)', 'filters',
	'/raaga/(.*)', 'tags',
	'/raaga', 'tags',
	'/taala/(.*)', 'tags',
	'/taala', 'tags',
	'/raga/(.*)', 'tags',
	'/raga', 'tags',
	'/tala/(.*)', 'tags',
	'/tala', 'tags',
	'/laya/(.*)', 'tags',
	'/laya', 'tags',
	'/gharana/(.*)', 'tags',
	'/gharana', 'tags',
	'/makam/(.*)', 'tags',
	'/makam', 'tags',
	'/usul/(.*)', 'tags',
	'/usul', 'tags',
	'/(.*)', 'index'
)

app = web.application(urls, globals())
	
class filters:
	def GET(self, collection):
		common_filters = ["performer", "instrument", "composer", "lyricist",\
		"form", "release", "work"]
		andalusian_filters = []
		carnatic_filters = ["raaga", "taala"]
		hindustani_filters = ["raga", "tala", "laya", "gharana"]
		ottoman_filters = ["makam", "usul"]
		web.header('Content-Type', 'application/json')
		if collection.lower() == "andalusian":
			return json.dumps({"common":common_filters, \
			"specific":andalusian_filters})
			#return self.dir_contents(self.path_collection+"Andalusian/audio")
		elif collection.lower() == "ottoman":
			return json.dumps({"common":common_filters, \
			"specific":ottoman_filters})
			#return self.dir_contents(self.path_collection+"Ottoman/audio")
		elif collection.lower() == "carnatic":
			return json.dumps({"common":common_filters, \
			"specific":carnatic_filters})
			#return self.dir_contents(self.path_collection+"Carnatic/audio")
		elif collection.lower() == "hindustani":
			return json.dumps({"common":common_filters, \
			"specific":hindustani_filters})
			#return self.dir_contents(self.path_collection+"Hindustani/audio")
		elif collection.lower() == "all":
			return json.dumps({"common":common_filters})
	
class index:
	def GET(self, name):
		#pyDict = {'param':name,'two':str(name)}
		return name
		#return render.index(web.data())
		web.header('Content-Type', 'application/json')
		return json.dumps(pyDict)

class composers:
	#TODO: change to WorkRelations, same as lyricists
	def GET(self, name=None):
		lname = [None]
		if name:
			lname = name.split("/")
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		#status, composers, msg = dao.getRelations('type', 'composer', table="work", collection=lname[-1])
		##return json.dumps({"composers": composers})
		#finalcomposers = []
		#if status:
			#finalcomposers = relationsByWorkInfo(dao, composers)
		finalcomposers = dao.getWorkRelationsInfo('composer', collection=lname[-1])
		return json.dumps({"composers": finalcomposers})
		
class composer:
	#TODO: change to WorkRelation, same as lyricist 
	def GET(self, name=None):
		if not name:
			return json.dumps({})
		lname = name.split("/")
		attr_name = "uuid" if re.search(uuid_regexp, lname[0]) else "name"
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		composer = dao.getWorkRelationInfo('composer', attr_name, lname[-1])
		return json.dumps({"composer": composer})

class lyricists:
	def GET(self, name=None):
		lname = [None]
		if name:
			lname = name.split("/")
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		#status, lyricists, msg = dao.getRelations('type', 'lyricist', table="work", collection=lname[-1])
		#finallyricists = []
		#if status:
			#finallyricists = relationsByWorkInfo(dao, lyricists)
		finallyricists = dao.getWorkRelationsInfo('lyricist', collection=lname[-1])
		return json.dumps({"lyricists": finallyricists})

class lyricist:
	def GET(self, name=None):
		if not name:
			return json.dumps({})
		lname = name.split("/")
		attr_name = "uuid" if re.search(uuid_regexp, lname[0]) else "name"
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		lyricist = dao.getWorkRelationInfo('lyricist', attr_name, lname[-1])
		return json.dumps({"lyricist": lyricist})

class performers:
	
	def __artistInfo(self, dao, uuid):
		artist = {}
		status, ainfo, msg = dao.getArtistInfo("uuid", uuid)
		artist = ainfo
		status, releases, msg = dao.getReleasesByArtist("uuid", uuid)
		artist["releases"] = len(releases) if status else 0
		status, instruments, msg = dao.getArtistRelationsAttribute("uuid", uuid, rel_table='recording', relation='instrument')
		artist["instruments"] = instruments if status else 0
		return artist
	
	def GET(self, name=None):
		#TODO problem with type=performer in relations
		lname = [None]
		if name:
			lname = name.split("/")
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		finalartists = {}
		status, artists, msg = dao.getArtistsRecordings(collection=lname[-1])
		if status:
			for artist in artists:
				if not finalartists.has_key(artist['uuid']):
					finalartists[artist['uuid']] = self.__artistInfo(dao, artist['uuid'])
					#finalartists[artist['uuid']] = {'uuid': artist['uuid'], 
									#'name': artist['name'], 
									#'collection': artist['collection'],
									#'recordings': {},
									#'recordings_relations': {}}
				#if not finalartists[artist['uuid']]['recordings'].has_key(artist['recording']['uuid']):
					#finalartists[artist['uuid']]['recordings'][artist['recording']['uuid']] = {'uuid': artist['recording']['uuid'], 'title': artist['recording']['title']}
		
		status, artistsrels, msg = dao.getArtistsRelations(rel_table="recording", relation=['vocal', 'instrument'], collection=lname[-1])
		if status:
			for artist in artistsrels:
				if not finalartists.has_key(artist['uuid']):
					finalartists[artist['uuid']] = self.__artistInfo(dao, artist['uuid'])
					#finalartists[artist['uuid']] = {'uuid': artist['uuid'], 
									#'name': artist['name'], 
									#'collection': artist['collection'],
									#'recordings': {},
									#'recordings_relations': {}}
				#if not finalartists[artist['uuid']]['recordings_relations'].has_key(artist['relation']['uuid']):
					#finalartists[artist['uuid']]['recordings_relations'][artist['relation']['uuid']] = artist['relation']
		#for uuid in finalartists:
			#finalartists[uuid]['recordings'] = finalartists[uuid]['recordings'].values()
			#finalartists[uuid]['recordings_relations'] = finalartists[uuid]['recordings_relations'].values()
		return json.dumps({"performers": sorted(finalartists.values())})

class performer:
	
	def __artistInfo(self, dao, uuid):
		artist = {}
		status, ainfo, msg = dao.getArtistInfo("uuid", uuid)
		artist = ainfo
		releases_uuids = {}
		status, releases, msg = dao.getReleasesByArtist("uuid", uuid)
		artist["releases"] = []
		if status:
			for release in releases:
				artist["releases"].append(release)
				releases_uuids[release["uuid"]] = 1
		artist["releases"] = releases if status else []
		status, releases, msg = dao.getReleasesByArtistInRecordings("uuid", uuid)
		if status:
			for release in releases:
				if not releases_uuids.has_key(release["uuid"]):
					artist["releases"].append(release)
					releases_uuids[release["uuid"]] = 1
		status, releases, msg = dao.getReleasesByArtistInRecordingRelations("uuid", uuid)
		if status:
			for release in releases:
				if not releases_uuids.has_key(release["uuid"]):
					artist["releases"].append(release)
					releases_uuids[release["uuid"]] = 1
		status, instruments, msg = dao.getArtistRelationsAttribute("uuid", uuid, rel_table='recording', relation='instrument')
		artist["instruments"] = instruments if status else []
		return artist
	
	def GET(self, name):
		web.header('Content-Type', 'application/json')
		if not name:
			return json.dumps({})
		lname = name.split("/")
		attr_name = "uuid" if re.search(uuid_regexp, lname[0]) else "name"
		#collection = lname[-1] if lname[-2] == "collection" else None
		dao = DAO.DAO()
		if len(lname) > 1:
			if lname[1] == "recordings":
				status, recordings, msg = dao.getRecordingsByArtist(attr_name, lname[0])
				drecordings = dict([(recording["uuid"], recording) for recording in recordings]) if status else {}
				status, recordingsrel, msg = dao.getRecordingsByArtistRelation(attr_name, lname[0])
				if status:
					for recordingrel in recordingsrel:  # merge also recording relations
						if not drecordings.has_key(recordingrel["uuid"]):
							drecordings[recordingrel["uuid"]] = recordingrel
				#finalrecordings = recordingsInfo(dao, drecordings.values())
				finalrecordings = [dao.getRecordingInfo("uuid", recording["uuid"]) for recording in drecordings.values()]
				return json.dumps({"recordings": finalrecordings})
			if lname[1] == "releases":
				finalreleases = []
				status, releases, msg = dao.getReleasesByArtist(attr_name, lname[0])
				if status:
					finalreleases = [dao.getReleaseInfo("uuid", release["uuid"]) for release in releases]
				return json.dumps({"releases": finalreleases})
		else:
			status, ainfo, msg = dao.getArtistInfo(attr_name, lname[0]) #TODO repeating the same function twice
			ainfo = self.__artistInfo(dao, ainfo['uuid'])
			return json.dumps({"performer": ainfo})
		return json.dumps(lname)
	
class releases:
	def GET(self, name=None):
		lname = [None]
		if name:
			lname = name.split("/")
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		status, releases, msg = dao.getReleases(collection=lname[-1], limit=None)
		finalreleases = []
		if status:
			finalreleases = [dao.getReleaseInfo("uuid", release["uuid"]) for release in releases]
		return json.dumps({"releases": finalreleases})

class release:
	def GET(self, name=None):
		web.header('Content-Type', 'application/json')
		if not name:
			return json.dumps({})
		
		lname = name.split("/")
		attr_name = "uuid" if re.search(uuid_regexp, lname[0]) else "title"
		dao = DAO.DAO()
		if len(lname) > 1:
			if lname[1] == "recordings":
				status, recordings, msg = dao.getRecordingsByRelease(attr_name, lname[0])
				finalrecordings = [dao.getRecordingInfo("uuid", recording["uuid"]) for recording in recordings]
				return json.dumps({"recordings": finalrecordings})
		else:
			release = dao.getReleaseInfo(attr_name, lname[-1])
			return json.dumps({"release": release})
		
class recordings:
	def __init__(self):
		self.recordings = {}
		
	def __intersection(self, list1, iteration=0):
		if iteration == 0: #first time
			for item in list1:
				if not self.recordings.has_key(item["uuid"]):
					self.recordings[item["uuid"]] = item
		else:
			temp_recordings = {}
			for item in list1:
				if self.recordings.has_key(item["uuid"]):
					temp_recordings[item["uuid"]] = self.recordings[item["uuid"]]
			self.recordings = temp_recordings
	
	def GET(self, name=None):
		lname = [None]
		if name:
			lname = name.split("/")
		
		query_struct = {}
		last_item = None
		if len(lname) > 1:
			for item in lname:
				if item in all_filters:
					if not query_struct.has_key(item):
						query_struct[item] = {"value": []}
					last_item = item
				elif item.startswith("filter="):
					if last_item: query_struct[last_item]["filter"] = item[item.find("filter=")+7:]
				else:
					if last_item: query_struct[last_item]["value"].append(item)
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		collection = None
		if query_struct.has_key('collection'):
			collection = query_struct['collection']['value'][0]
			del query_struct['collection']
		if len(query_struct) > 0:
			i = 0
			for field in query_struct:
				for value in query_struct[field]["value"]:
					if field == "work": # filter by given work
						attr_name = "uuid" if re.search(uuid_regexp, value) else "title"
						status, recordings, msg = dao.getRecordingsByWork(attr_name, value)
					elif field == "instrument": # filter by given instrument
						status, recordings, msg = dao.getRecordingsByInstrument(value, collection=collection)
					elif field == "recording":
						status, recordings, msg = dao.getRecordings(uuid=value)
					elif field == "release":
						attr_name = "uuid" if re.search(uuid_regexp, value) else "title"
						status, recordings, msg = dao.getRecordingsByRelease(attr_name, value)
					elif field == "performer":
						attr_name = "uuid" if re.search(uuid_regexp, value) else "name"
						status1, recordings, msg = dao.getRecordingsByArtist(attr_name, value)
						drecordings = dict([(recording["uuid"], recording) for recording in recordings]) if status1 else {}
						status2, recordingsrel, msg = dao.getRecordingsByArtistRelation(attr_name, value)
						if status2:
							for recordingrel in recordingsrel:  # merge also recording relations
								if not drecordings.has_key(recordingrel["uuid"]):
									drecordings[recordingrel["uuid"]] = recordingrel
						
						recordings = drecordings.values()
						status = True if status1 or status2 else False
						#return recordings
					elif field in ["composer", "lyricist"]:
						attr_name = "uuid" if re.search(uuid_regexp, value) else "name"
						artist = dao.getWorkRelationInfo(field, attr_name, value)
						recordings = []
						if len(artist) > 0:
							#return json.dumps({"artist": artist})
							for work in artist[0]["works"]:
								status, lrecordings, msg = dao.getRecordingsByWork("uuid", work["uuid"])
								recordings.extend(lrecordings)
					elif field in specific_filters: # filter by specific culture filter
						attr_name = "id" if value.isdigit() else "tag"
						status, recordings, msg = dao.getRecordingsByTag(attr_name, value, category=field)
					else: # default filter by collection
						status, recordings, msg = dao.getRecordings(collection=collection, limit=None)
					if status: 
						self.__intersection(recordings, i)
					elif not status and recordings == "empty": self.__intersection([], i) #TODO: hardcoded
					i += 1
				
			#if lname[0] == "work": # filter by given work
				#attr_name = "uuid" if re.search(uuid_regexp, lname[1]) else "title"
				#status, recordings, msg = dao.getRecordingsByWork(attr_name, lname[1])
			#elif lname[0] == "instrument": # filter by given instrument
				#status, recordings, msg = dao.getRecordingsByInstrument(lname[1], collection=collection)
			#elif lname[0] in specific_filters: # filter by specific culture filter
				#status, recordings, msg = dao.getRecordingsByTag(tag=lname[1], category=lname[0])
			#else: # default filter by collection
				#status, recordings, msg = dao.getRecordings(collection=lname[-1], limit=None)
			return json.dumps({"recordings": self.recordings.values()})
		else: # when no collection is provided
			#TODO: what if work or any specific filter is not provided with value?
			status, recordings, msg = dao.getRecordings(collection=lname[-1], limit=None)
			return json.dumps({"recordings": recordings})
		#finalrecordings = []
		#if status:
			#finalrecordings = [dao.getRecordingInfo("uuid", recording["uuid"]) for recording in recordings]
		#TODO hardcoded, ind a better way to optimize this query
		#finalrecordings = recordings
		#return json.dumps({"recordings": finalrecordings})
		
class recording:
	def GET(self, name=None):
		if not name:
			return json.dumps({})
		lname = name.split("/")
		attr_name = "uuid" if re.search(uuid_regexp, lname[0]) else "title"
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		recording = dao.getRecordingInfo(attr_name, lname[-1])
		return json.dumps({"recording": recording})

		
class works:
	def GET(self, name=None):
		lname = [None]
		if name:
			lname = name.split("/")
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		finalrecordings = []
		status, works, msg = dao.getWorks(lname[-1])
		return json.dumps({"works": works})
		
class instruments:
	def GET(self, name=None):
		lname = [None]
		if name:
			lname = name.split("/")
		web.header('Content-Type', 'application/json')
		dao = DAO.DAO()
		finalrecordings = []
		status, instruments, msg = dao.getInstruments(lname[-1])
		return json.dumps({"instruments": instruments})

class instrument:
	def GET(self, name):
		web.header('Content-Type', 'application/json')
		if not name:
			return json.dumps({})
		lname = name.split("/")
		if len(lname) > 1:
			if lname[1] == "recordings":
				dao = DAO.DAO()
				finalrecordings = []
				collection = lname[-1] if lname[-2] == "collection" else None
				status, recordings, msg = dao.getRecordingsByInstrument(lname[0], collection=collection)
				if status:
					finalrecordings = [dao.getRecordingInfo("uuid", recording["uuid"]) for recording in recordings]
				return json.dumps({"recordings": finalrecordings})
		return json.dumps(lname)
		
class tags:
	def GET(self, name=None):
		name = web.url()
		lname = name.split("/")
		web.header('Content-Type', 'application/json')
		if lname[1] in specific_filters:
			dao = DAO.DAO()
			if len(lname) > 2:
				pass
			else:
				status, finaltags, msg = dao.getTagsByCategory(lname[1])
				return json.dumps({"%ss" % lname[1]: finaltags})
		return json.dumps(lname)
       
#app = web.application(urls, globals(), autoreload=False)
application = app.wsgifunc()

if __name__ == '__main__': 
	app.run()

