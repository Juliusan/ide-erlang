#See https://flight-manual.atom.io/behind-atom/sections/developing-node-modules/

PATH_TO_ATOM=/home/julius/Dokumentai/Mokslai/Programos/JavaScript/atom-1.51.0-amd64
PATH_TO_APM=${PATH_TO_ATOM}/resources/app/apm/node_modules/.bin/apm
ATOM_HOME=${PATH_TO_ATOM}/.atom

all: build

build:
	echo "What to do?"

install:
	ATOM_HOME=${ATOM_HOME} ${PATH_TO_APM} install
	ATOM_HOME=${ATOM_HOME} ${PATH_TO_APM} link -d

clean:
	rm -rf server
