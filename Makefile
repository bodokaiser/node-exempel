BROWSERIFY			= ./node_modules/.bin/browserify
MOCHA_PHANTOMJS = ./node_modules/.bin/mocha-phantomjs

MOCHA_FLAGS = \
	--reporter spec

PHANTOMJS_FLAGS = \
	--debug=true

BROWSERIFY_FLAGS = \
	--debug

build:
	$(BROWSERIFY) $(BROWSERIFY_FLAGS) \
		opt/test/index.js > opt/test/build.js

test: build
	$(MOCHA_PHANTOMJS) $(MOCHA_FLAGS) $(PHANTOMJS_FLAGS) \
		opt/test/index.html

clean:
	@rm opt/test/build.js
