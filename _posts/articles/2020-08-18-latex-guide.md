---
layout: post
title: "Latex guide"
author: Deren
categories: articles
excerpt: "Latex writing guide"
comments: true
image:
  feature: header_ped.png
share: true
tags: [latex, writing]
date: 2020-08-18
---


### What is latex, and why use it?
Latex is a coding language for formatting text into a typeset document, such
as a PDF. It is used widely in scientific writing and publishing as a way of 
reusing a design template so that you as the writer can focus on content.
I prefer writing in Latex because it allows me to use coding practices like
git version control, commenting sections of text, and writing
text in a fast and responsive text editor. Most importantly, it also 
makes working with bibtex citations super easy and convenient. Because latex
works seamlessly with git and GitHub it helps me to stay organized by 
creating GitHub repositories for each manuscript, so that me
and my collaborators can all work on a cloud-based document together.


### Installing latex
My instructions below are for Ubuntu Linux, and will work in the Windows 
subsystem for Linux as well. If you are on MacOS I'm sure you can find 
similar installation instructions using google. In your linux bash terminal 
use `apt` to install latex with the following command, which may take a 
few minutes to install.

```bash
sudo apt install texlive-latex-extra
```

That's it, you are now ready to make a .tex document and compile it with 
latex. In particular, we will use the program `pdflatex` to compile tex
files into PDF documents.


### Compile your first tex file.
Open any text editor and create a new file called `hello-world.tex` and 
write into it the text below and save the file.

```latex
\documentclass{article}
\begin{document}
Hello world 
\end{document}
```

This is a super simple tex document that includes the very minimum that is
required to compile. The same tex commands are copied below but with additional
notes for each section added by using the comment character (%). The ability
to add comments to your tex files is a really important and powerful component
to writing in latex. Commented lines are not compiled into the PDF. They can
be left in the tex file as notes to yourself or collaborators, or to save 
earlier versions of a text while you are in the process of editing.

```latex
% This is a comment.

% The document class sets an overall style for the document 
% and is usually the first command in a tex file.
\documentclass{article}

% additional add-on packages can be loaded here (see later examples)
% or additional styling options are added here, before beginning the doc.

% This command starts the document. Everything after this is intended to 
% be printed into the document (except comments). Everything
% before this involves loading styles and options that will be used in 
% this section to style text and images.
\begin{document}

% This text is part of the document. This comment line however will 
% not appear in the document.
Hello world 

% This ends the document. Anything after this will be ignored.
\end{document}
```

You can now compile the tex document (using either one of the two tex files 
above since they are identical other than comments) by calling the command below 
from your bash terminal. Make sure to reference the full or relative path to
the tex file that you just created. This will print some information to the 
terminal about what it is doing and any errors it encountered. The output
is mostly mumbo jumbo. After it finishes use `ls` to look in your current 
directory. You should see a new `hello-world.pdf` file containing the typeset
document. A few additional files will also be created which contain errors
or auxiliary information such as citations. You can generally ignore those 
other files.

```bash
pdflatex hello-world.tex
```

### Setup latex with your text editor (e.g., sublime)
Now that you've compiled a tex file from your bash terminal, you can move
to a more advanced setup, which involves compiling the tex file directly 
from your text editor, thus avoiding the additional step of having to 
open a terminal. There are several options for this, including many 
dedicated latex editors/IDEs that are designed specifically to display 
a PDF next to your tex document (and online versions of this like overleaf). 
These can be nice, but I find them overall to be kind of clunky and ugly. 

Instead I recommend learning to use latex in a powerful coding text editor
such as sublimetext or vscode. This allows you to learn and use the same 
set of hotkeys and keystrokes to write text efficiently and maneuver around 
lines and paragraphs that you use when writing code.

For sublime text you can find instructions online for how to set it up for 
latex. For me, this involved adding a latex command to the build system to 
compile a .tex file when I press the F7 key. This makes it very easy to edit
the .tex in my editor, press F7, and see the changes in the PDF document.
This can also be setup on Windows as well, where latex is installed in 
your Linux subsystem, but Sublime is installed in Windows, 
[instructions here](https://guido.vonrudorff.de/2018/latex-on-windows-subsystem-for-linux-in-sublime-text/).


### Using comments 
A benefit of using latex for writing large documents is that you can very 
easily comment out regions of the text that you wish to change, leaving behind
a copy of the unedited version. I use this feature a lot when writing or 
editing. Unlike word or googledocs you don't need to worry about whether your
edits are easy to read over the previous version, and making lots of edits 
will not lag the system. I leave a copy of the unedited version in a comment
until I'm satisfied it is no longer needed and then remove it. 

### Writing for version control
I recommend reading a simple latex tutorial to learn how the latex 
syntax works. For example, similar to markdown, line breaks are ignored
in latex. This is a useful feature for interpreting your text like code.
I always manually break paragraphs into lines that <=80 characters to avoid
line wrapping when working in latex. This makes it so that when you push 
or pull changes with git the changes to each line will be highlighted and 
easy to find. If you write paragraphs as a single unbroken line that is 
wrapped by your editor then you will not be able to find changes in each 
version as easily. 

### Pushing changes to GitHub
Push changes to git frequently, especially when working with collaborators
to avoid conflicts from arising when you both edit the same text. If 
conflicts do arise, use your text editor to go through one by one the regions
between the `>>>` and `<<<` markers to select which version of the text 
you wish to keep. Then delete the delimiter markers. 

Only commit and push the .tex file to git, not the PDF or auxiliary 
files. You and your collaborators can each compile the PDF anew when
you load the changes to the .tex file. Git is great for versioning 
text-based documents like .tex but not PDFs. Add, commit and push
new changes like below. 

```bash
# pull in changes from your collaborators
git pull 

# example git commit to push changes to a manuscript
git add hello-world.tex
git commit -m "added genomics section to Methods"
git push
```