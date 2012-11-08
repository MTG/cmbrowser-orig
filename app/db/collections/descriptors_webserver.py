# -*- coding: utf-8 -*-

import os, shutil
import Config_webserver as Config

shutil.rmtree(Config.DESCRIPTORS_WEB_LINK_PATH)
os.mkdir(Config.DESCRIPTORS_WEB_LINK_PATH)

descriptors = ['lowlevel.PitchFiltered', 'lowlevel.SpectralRms', 'rhythm.OnsetTimes']

for collection in ["Hindustani", "Turkey-makam", "Carnatic"]:
	f = open(collection + ".tsv")
	for line in f:
		data = line.strip().split("\t")
		for descriptor in descriptors:
			fullpath = Config.DESCRIPTORS_PATH + "/descriptors/" + collection + "/" + data[0] + "." + descriptor + ".wav"
			mbid = data[1]
			linkpath = "%s/%s.mp3.%s.wav" % (Config.DESCRIPTORS_WEB_LINK_PATH, mbid, descriptor)
			if os.path.exists(fullpath):
				print fullpath
				#print linkpath
				if not os.path.exists(linkpath):
					#os.symlink(fullpath, linkpath)
					shutil.copy(fullpath, linkpath)
	f.close()
