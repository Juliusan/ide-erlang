# ide-erlang package

Provides support of Erlang language for Atom IDE, using `atom-languageclient`
and `erlang_ls` LSP server.

**Currently in development.**

Known and somewhat tested functions:
* `erlang_ls` can be downloaded and compiled. It is now downloaded, if it was
  downloaded earlier.
* `erlang_ls` is started. Communication through `stdio` only. Debug log is
  written to `.cache/erlang_ls` in Linux.
* `Goto declaration` works for functions (even in other files).
* Functions, that have specs get them displayed as a tooltip.

TODO list:
* Check Atom dependencies of the package and publish a real Atom package.
* Make documentation (source) of dependencies available for `erlang_ls`.
* Check the loading time. Currently the package almost freezes the computer for
  several seconds while the sources are being analysed. Maybe it is because of
  Atom dev environment? Can standard Erlang modules be indexed once and not every
  time Atom is started?
* Check all the functions `erlang_ls` and Atom IDE can provide.
* Maybe add some configuration possibilities.

Known bugs:
* Sometimes when downloading server the following error appears:
  ```
    Error: unexpected end of file
  ```
  The following text appears in console:
  ```
    Uncaught (in promise) Error: unexpected end of file
        at Zlib.zlibOnError [as onerror] (zlib.js:166)
  ```
  It appears that the extraction is attempted before download is complete. However
  as far as I can see, the promises are handled correctly and debugging confirms
  it. If such situation occurs, server loading should be restarted.

# References

This package is based on [`atom-languageclient`](https://github.com/atom/atom-languageclient).<br>
It uses Language Server Protocol and [`erlang_ls` server](https://github.com/erlang-ls/erlang_ls)
to provide its functionality.<br>
The source code of [`ide-java` package](https://github.com/atom/ide-java) was used
heavily to develop this package.

# Disclaimer

I am not a very good JavaScript programmer. I am not familiar with Atom. And
this is the first plug-in (package) I've ever written. So I will be very
grateful for every constructive criticism and help with this project. I believe
that Erlang is a fantastic language and it should be supported by Atom. I want
to use Atom to develop my Erlang projects. Please, help me.

This work was inspired by a wonderful talk by `erlang_ls` author Roberto Aloi,
called ["Boost your productivity with the Erlang Language Server"](https://youtu.be/8FibGzqygo0),
in [Code BEAM V](https://codesync.global/conferences/code-beam-sto/) conference
on 11th September, 2020.

<!--![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)-->
