SHELL := /bin/bash
PATH  := node_modules/.bin:$(PATH)

all: build/gmap.es5.min.js

clean:
	rm -rf ./build

build/gmap.js: src/gmap.js
	@mkdir -p $(@D)
	cat $< | sed "s#../node_modules#../../#" > $@

build/gmap.es5.js: build/gmap.js
	@mkdir -p $(@D)
	babel $< -o $@

build/gmap.es5.min.js: build/gmap.es5.js
	@mkdir -p $(@D)
	minify $< > $@

.PHONY: all clean
