# message-accumulator

A package to help transform localizable messages in a variety of
syntaxes into a form that
translators can easily translate without knowing anything about
that syntax, and after translation, back again into a form that
programs can easily use to recompose localized messages in the
original syntax.

In HTML or JSX, for example, whole translatable messages are hard to identify.
In HTML for example, some tags are commonly found inside of whole
sentences, and some are not. What forms a whole translatable
message?

Consider this snippet:

```
<div>
	<span class="body">
	    There are <a href="http://url" title="localizable title">50 files</a> in the <span class="copyright">Simple Markdown</span> system.
	</span>
</div>
```

In this case, the outer "div" and "span" tags are not part of any localizable
snippet of text. The entire string "There are 
&lt;a href="http://url" title="localizable title"&gt;50 
files&lt;/a&gt; in the &lt;span class="copyright"&gt;Simple Markdown&lt;/span&gt; system." 
should be localized as a single sentence because it would not 
make any sense to localize the parts "There are ",
"50 files", " in the ", "Simple Markdown", and " system." separately. 
They are not simply phrases that you can
translate out-of-context, and then re-concatenate and have
any hope that it will make logical sense in many other languages. Human
language is more complicated than that! In order for translators to do
a good job, they need the entire sentence.

The only problem is that translators
are not so good with programming language syntax and tend to do things
like translate HTML tag name and attribute values such as the names of
CSS classes. Things are worse in JSX where components can have any name
and even translators who are familiar with HTML tags are confused as to
what is translatable and what is not. In our example above, we even have
the added complication
that the value of the "title" attribute of the "a" tag is actual
localizable text, which is even more confusing to the translators.

In order to avoid this whole mess, we need to hide the contents of such tags
from the translators and let them translate with minimal syntax
getting in the way. The sentence above would be easier for translators
to translate if it were something like this:

```
There are <c0>50 files</c0> in the <c1>Simple Markdown</c1> system.

where:

c0 = <a href="http://url" title="localizable title">
c1 = <span class="copyright">
```

In this way, translators can focus on the linguistic part of the translation
and only have to make sure that the corresponding portion of translation
is surrounded by the pseudo-tags "c0" and "c1", where "c" stands for
the word "component". 

Translating this type of message has many advantages:
 
    * The contents of the tags in the mapping below is hidden from the
      translators, so they cannot mess it up by translating things that should
      not be translated and by leaving out brackets or quotation characters.
    * It prevents code injection attacks. A nefarious person working at the translation
      agency would not be able to insert some malicious javascript code in the 
      middle of a translation hidden inside of some HTML tags because source string
      does not contain HTML.
    * The contents of the tags can change frequently without affecting the
      content of the source string, and therefore the translation. A designer
      can add a new CSS class if they desire, and the programmer can change
      the contents of the href attribute of a link tag without causing a
      retranslation of the string. The new CSS class and url will be 
      recomposed into the translated string later.


Now in many languages, grammar is different than in English, so it is 
entirely possible that the order of the components is different. Also,
the nesting of those components may change. We need to allow the translators
the freedom to do what is right for the grammar of their target language.
That means we need to be able to decompose a translated string back
into a tree of syntax nodes that can easily be transformed back into
the source programming language again, whether that is HTML, JSX, or
even Markdown. This is accomplished by reapplying the mapping between
the components and the original tag text to the appropriate parts
of the translation.

Consider this translation of our example above into German:

```
In den <c1>Simple Markdown</c1> System, gibt es <c0>50 Dateien</c1>.
```

Note that the order of the components is indeed reversed from English.
Ideally, we would like to decompose this into this tree:

```
root
  "In den "
  c1
    "Simple Markdown"
  "System, gibt es"
  c0
    "50 Dateien"
  "."
```

From there you can easily reapply the mapping `c1 = <span class="copyright">`
and `c0 = <a href="http://url" title="localizable title">` to reconstruct
the HTML into translated HTML.

In many cases, the caller of
this message accumulator class will have an abstract syntax tree (AST) in memory
which is the result of parsing the original English source file with a 
standard parser. In this case,
"c0" and "c1" would map to particular nodes in that tree instead of to snippets
of text containing the HTML tags.
The caller's AST can be modified for the translation by reusing existing AST nodes
in the place of the components.

The goal of the message-accumulator class is to help the caller accumulate
a localizable unit (a "message") while traversing the AST of the source file,
as well as to be able to decompose a translated string back into a tree
that can be easily transformed into AST nodes again.

Usage
-----

