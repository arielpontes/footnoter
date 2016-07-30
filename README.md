# Footnoter

Footnoter is an inline reference to footnote converter written in Javascript.
It is compatible with Wordpress and Medium (and any other editor that let's you
edit rich text using HTML without sanitizing your input too much). It takes
inline references of this format:

    <p>
      This is true[ref]Article[/ref]. This is not[ref]Another article[/ref].
    </p>

And replaces them with a series of numbered superscript anchors linking to a
list of references that is generated at the bottom of the page.

    <p>
      This is true<sup><a href="#fn1" id="afn1">[1]</sup>. This is not<sup><a href="#fn2" id="afn2">[2]</sup>.
    </p>

    <h1>References</h1>
    <hr>
    <ol>
      <li id="fn1"><a href="#afn1">^</a> Article</li>
      <li id="fn2"><a href="#afn2">^</a> Another article</li>
    </ol>


The live page can be accessed
[here](https://rawgit.com/arielpontes/footnoter/master/index.html).

In the live page you can also find a bookmarklet to parse your references from
inside the Medium editor. The code in the bookmarklet is a concatenation of
[jquery-2.2.1.min.js](https://code.jquery.com/jquery-2.2.1.min.js) and a minified version of
[js/bookmarklets/medium.js](https://github.com/arielpontes/footnoter/blob/master/js/bookmarklets/medium.js).
The code was minified with [JSCompress](http://jscompress.com/) and wrapped inside a
bookmarklet friendly format with @mrcoles' [bookmarklet creator](http://mrcoles.com/bookmarklet/).

This tool was created because I'm a heavy user of the
[footnotes](https://wordpress.org/plugins/footnotes/) WordPress plugin and
wanted to make my posts more portable without having to do a lot of manual work.
