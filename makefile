SHELL := /bin/bash
PATH  := node_modules/.bin:$(PATH)

all: build/gmap.js build/gmap.min.js

clean:
	rm -rf ./build

build/gmap.js: src/gmap.js
	@mkdir -p $(@D)
	babel $< -o $@

build/gmap.min.js: build/gmap.js
	@mkdir -p $(@D)
	minify $< > $@

.PHONY: all clean
