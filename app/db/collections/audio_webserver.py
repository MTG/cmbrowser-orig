# -*- coding: utf-8 -*-

import os, shutil
import Config_webserver as Config

shutil.rmtree(Config.WEB_LINK_PATH)
os.mkdir(Config.WEB_LINK_PATH)
os.mkdir(Config.WEB_LINK_PATH+"/mp3")
os.mkdir(Config.WEB_LINK_PATH+"/wav")
os.mkdir(Config.WEB_LINK_PATH+"/ogg")

for collection in ["Hindustani", "Turkey-makam", "Carnatic"]:
	f = open(collection + ".tsv")
	for line in f:
		data = line.strip().split("\t")
		fullpath = Config.PATH + "/" + collection + "/audio/" + data[0]
		mbid = data[1]
		#link = "ln -s %s %s/%s.mp3" % (fullpath, Config.WEB_LINK_PATH, mbid)
		linkpath = "%s/mp3/%s.mp3" % (Config.WEB_LINK_PATH, mbid)
		print fullpath
		#print linkpath
		if not os.path.exists(linkpath):
			os.symlink(fullpath, linkpath)
	f.close()



for collection in ["Hindustani", "Turkey-makam", "Carnatic"]:
        f = open(collection + ".tsv")
        for line in f:
                data = line.strip().split("\t")
                mbid = data[1]
                fullpath = Config.AUDIO_PATH + "/audio/wav/" + data[1] + ".wav"
                linkpath = "%s/wav/%s.wav" % (Config.WEB_LINK_PATH, mbid)
                print fullpath
                if not os.path.exists(linkpath):
                        os.symlink(fullpath, linkpath)
        f.close()

