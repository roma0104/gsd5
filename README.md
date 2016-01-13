# GSD5

A Getting-Things-Done tool for the TiddlyWiki5 environment.

GSD5, or Getting-Stuff-Done 5, is a plugin for [TiddlyWiki5](http://tiddlywiki.com) *[(github)](https://github.com/Jermolene/TiddlyWiki5/)* that attempts to combine the workflow and philosophy of David Allen's **[Getting Things Done](http://www.amazon.com/Getting-Things-Done-Stress-Free-Productivity/dp/0142000280/)** with the TiddlyWiki5 platform.  GSD5 is heavily influenced by [mGSD](http://mgsd.tiddlyspot.com/) for TiddlyWiki classic.

#### Disclaimer
GTD® and Getting Things Done® are registered trademarks of the [David Allen Company](http://www.davidco.com). GSD5 is not affiliated with or endorsed by the David Allen Company.

# Obtaining

To the fun stuff or at least more productive!

### Stable(ish)

GSD5 is most definitely a work-in-progress project and beta quality.  There might be changes that might break from past versions in ways that make forward comptatiblity of user-created content non-trival to correct.

http://gsd5.tiddlyspot.com

### Nightly

To try GSD5's latest commits without having to build it yourself.

http://gsd5-nightly.tiddlyspot.com

*Nightly builds are performed 01:00 UTC*

### Building

If you wish to build GSD5 as a standalone file:

- Clone [TiddlyWiki5](https://github.com/Jermolene/TiddlyWiki5/)
- Clone this repo (or your fork of it). Make sure the two repos are side by side, rather than with one inside the other's directory.
- Change directory to the top level of the GSD5 directory.
- To serve GSD5 using node.js run `bin/serve.sh`, then visit <http://localhost:8080> with your browser.
- To build an empty GSD5 file run `bin/build.sh`.

Note there are currently no .cmd equivalents of the serve.sh and build.sh scripts for windows users (but perhaps you can write them based on the bash versions).

*This method will build against the latest commits from both TiddlyWiki5 and GSD5, things may be broken or act oddly.  Checkout to latest releases for both if you want a more stable build.  I usually test with Chromium.*
