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

### Build

If you wish to build GSD5 as a standalone file, this is the method of building I use:

1. Clone [TiddlyWiki5](https://github.com/Jermolene/TiddlyWiki5/).
2. Create the following directory: `~/TiddlyWiki5/plugins/gsd5`
3. Change directories to the directory you just created.
4. Clone this repository.  The finally layout should appear as: `~/TiddlyWiki5/plugins/gsd5/core/{...}`
5. Return to TiddlyWiki5 root. `~/TiddlyWiki5`
6. Navigate to `./editions`
7. Duplicate the directory `./empty` and rename it to `gsd5`.
8. Edit the file `./gsd5/tiddlywiki.info`.
9. In the `plugins` property add `"gsd5/core"` to the list. No trailing commas.
10.  Add or remove any other plugins or themes. (Remember GSD5 is rather invasive and may not play well with other plugins)
11. Return to TiddlyWiki5 root. `~/TiddlyWiki5`
12. Start the server: `./bin/serve.sh ./editions/gsd5`
13. Navigate to http://localhost:8080 or whatever your server returns in the console.

*This method will build against the latest commits from both TiddlyWiki5 and GSD5, things may be broken or act oddly.  Checkout to latest releases for both if you want a more stable build.  I usually test with Chromium.*
