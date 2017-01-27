import subprocess
import sublime
import sublime_plugin
import os
import os.path
import platform
import json
from os.path import dirname, realpath

REFACTOR_PLUGIN_FOLDER = dirname(realpath(__file__)) + "/"

class RefactorBaseClass(sublime_plugin.TextCommand):
	currentCursorPosition = -1

	# def init(self, edit, active_group=False):
	#     '''Restores user settings.'''
	#     settings = sublime.load_settings('Refactor.sublime-settings')

	#     for setting in ALL_SETTINGS:
	#         if settings.get(setting) != None:
	#             self.view.settings().set(setting, settings.get(setting))

	#     NODE_PATH = self.view.settings().get('nodePath', 'node')
	#     print((__name__ + '.sublime-settings'))
	#     print(NODE_PATH)

	def printError(self, message):
		print('JS Truth Table Error: ' + message)

	def executeNodeJsShell(self, cmd):
		out = ""
		err = ""
		result = ""
		if (platform.system() is "Windows"):
			newCmd = cmd
		else:
			newCmd = " ".join("'" + str(x) + "'" for x in cmd)

		p = subprocess.Popen(newCmd, shell=True, stdout=subprocess.PIPE,  stderr=subprocess.PIPE)
		(out, err) = p.communicate()
		if err.decode('utf-8') != '':
			self.printError(str(err))
		else:
			result = out

		if result:
			return result.decode('utf-8')
		else:
			return ''

class GeneratetruthCommand(RefactorBaseClass):
	def run(self, edit):
		selection =  self.view.substr(self.view.sel()[0])
		print(selection)

		cmd = ['node', REFACTOR_PLUGIN_FOLDER + 'index.js', selection]
		refactoredText = self.executeNodeJsShell(cmd)

		newBuffer = sublime.active_window().new_file()
		newBuffer.insert(edit, 0, refactoredText)
