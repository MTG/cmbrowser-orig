# -*- coding: utf-8 -*-

import os, shutil
import Config

shutil.rmtree(Config.WEB_LINK_PATH)
os.mkdir(Config.WEB_LINK_PATH)

for collection in ["Hindustani", "Turkey-makam", "Carnatic"]:
	f = open(Config.AUDIO_PATH + "/" + collection + "/metadata/" + collection + ".tsv")
	for line in f:
		data = line.strip().split("\t")
		fullpath = Config.PATH + "/" + collection + "/audio/" + data[0]
		mbid = data[1]
		#link = "ln -s %s %s/%s.mp3" % (fullpath, Config.WEB_LINK_PATH, mbid)
		linkpath = "%s/%s.mp3" % (Config.WEB_LINK_PATH, mbid)
		print fullpath
		if not os.path.exists(linkpath):
			os.symlink(fullpath, linkpath)
	f.close()
