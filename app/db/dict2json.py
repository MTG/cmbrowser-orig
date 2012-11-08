import sys
import json

if len(sys.argv) < 2:
	print "Usage: python %s python_dict_file" % sys.argv[0]
	sys.exit()
	
python_dict = eval("{%s}" % open(sys.argv[1]).read())
prefix = sys.argv[1]
python_json = prefix[:prefix.rfind(".")]+".json"
json.dump(python_dict, open(python_json, "w"))