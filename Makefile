.SILENT:

install: install_node install_jshint install_uglify install_phantomjs

install_node:
	brew install node

install_npm:
	curl https://npmjs.org/install.sh | sudo sh

install_jshint:
	npm install jshint -g

install_uglify:
	npm install uglify-js

install_phantomjs:
	brew install phantomjs
	sudo npm install phantom-jasmine -g

jshint:
	jshint src/audio-js.js

test:
	phantomjs test/jasmine/js/run_jasmine_test.coffee test/runner.html

minify:
	uglifyjs src/audio-js.js --compress --mangle --output src/audio-js.min.js