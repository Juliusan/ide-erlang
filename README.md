# ide-erlang package

Provides support of Erlang language for Atom IDE, using `"atom-languageclient`
and `erlang-ls` LSP server.

**Currently in developement.**

Known and somewhat tested functions:
* `Erlang-ls` can be downloaded and compiled. It is now downloaded, if it was
  downloaded earlier.
* `Erlang-ls` is started. Communication through `stdio` only. Debug log is
  written to `.cache/erlang-ls` in Linux.
* `Goto declaration` works for functions (even in other files).
* Functions, that have specs get them displayed as a tooltip.

TODO list:
* Move log file close to the package source
* Make documentation (source) of dependencies available for `erlang-ls`
* Check the loading time. Currently the package almost freezes the computer for
  several seconds while the sources are being analysed. Maybe it is because of
  Atom dev environment? Can standard Erlang modules be indexed once and not every
  time Atom is started?
* Check all the functions erlang-ls and atom IDE can provide.
* Maybe add some configuration possibilities.

# Disclaimer

I am not a very good JavaScript programmer. I am not familiar with Atom. And
this is the first plug-in (package) I've ever written. So I will be very
grateful for every constructive criticism and help with this project. I believe
that Erlang is a fantastic language and it should be supported by Atom. I want
to use Atom to develop my Erlang projects. Please, help me.

<!--![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)-->
