# -*- coding: utf-8 -*-


import os, pickle, sys
import json
import pycurl, codecs, StringIO
from urllib import quote
from time import sleep

import MySQLdb
import pprint # Used for formatting the output for viewing, not necessary for most code
from wikitools import wiki, api



class Database:
	def __init__(self):
		self.database = "compmusic" 
		self.user = "compmusic"
		self.host = "localhost"
		self.passwd = "compmusic123"
	def connection(self):
		# Connect to the DB
		#print "Connecting to DB"
		try:
			conn = MySQLdb.connect(db=self.database, user=self.user, host=self.host, passwd = self.passwd)
		except MySQLdb.OperationalError, msg:
			print "Cannot connect to the database: %s" % unicode(msg)
			return False
		return conn
	
	def getArtistNames(self, collection=None):
		str_collection = "WHERE"
		if collection:
			str_collection = "WHERE c.name = '%s' AND" % collection
		conn = self.connection()
		data = (False, "connection", "")
		if conn:
			curs = conn.cursor()
			try:
				query = """SELECT DISTINCT a.name
				FROM `artist` a, `collection` c
				%s a.collection_mbid = c.mbid
				ORDER BY name""" % (str_collection)
				curs.execute(query.encode("utf-8"))
				rows = curs.fetchall()
				if len(rows) > 0:
					drows = []
					for row in rows:
						drow = row[0]
						drows.append(drow)
					data = (True, drows, "")
				else:
					data = (False, "empty", "")
			except MySQLdb.OperationalError, msg:
				data = (False, "query", msg)
			conn.close()
		return data
		
database = Database()
status, names, msg = database.getArtistNames(collection="Ottoman")

pickle.dump(names, open("artists_turkish.pickle", "w"))

artists = pickle.load(open("artists_turkish.pickle"))

MAX_RETRIES_URL_OPEN = 5

#site = wiki.Wiki("http://www.mediawiki.org/w/api.php")
#params = {'action':'opensearch',
    #'search':'jasraj',
#}
#req = api.APIRequest(site, params)

#res = req.query(querycontinue=False)
#pprint.pprint(res)


def get_json(url):
	c = pycurl.Curl()
	for i in xrange(MAX_RETRIES_URL_OPEN):
		sleep(2) # be nice!
		try:
			b = StringIO.StringIO()
			c.setopt(pycurl.WRITEFUNCTION, b.write)
			#c.setopt(pycurl.INTERFACE, "193.145.55.111")
			c.setopt(pycurl.URL, str(url))
			c.perform()
			parsed = json.loads(b.getvalue())
			return parsed
		except IOError:
			print "(%d/%d) Failed trying to get: %s." % (i, MAX_RETRIES_URL_OPEN, url)
			return None
		except ValueError:
			return None

i = 0

f = codecs.open("artists_turkish_wikipedia.tsv", "w", "utf-8")
for artist in artists:
	#artist = "jasraj"
	url = u"http://tr.wikipedia.org/w/api.php?action=opensearch&search=" + quote(artist)
	data = get_json(url)
	#print data
	results = ["http://tr.wikipedia.org/wiki/"+quote(item.encode("utf-8")) for item in data[1]]
	f.write("%s\t%s\n" % (data[0], results))
	i += 1
	if i % 10 == 0:
		print i, "artists processed"
f.close()