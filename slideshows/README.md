
### Example file tree for hosting jupyter presentations
.
+-- /slideshows
|   +-- reveal.js/
|   +-- slideshow_1/
|   |   +-- notebook_1.ipynb
|   |   +-- index.html
|   +-- slideshow_2/
|   |   +-- notebook_2.ipynb
|   |   +-- index.html


### Build the HTML presentation
cd into one of the slideshow directories and run *nbconvert*.

```bash
jupyter-nbconvert notebook.ipynb --to slides --output index
```


### Serve the notebook presentation locally

This will create notebook.slides.html and serve it with a 

```bash
jupyter-nbconvert notebook.ipynb --to slides --post serve
```

### hosting on github
This will write the html file with the path to the local version 
of reveal.js which I keep one directory above the slides 
in `/slideshows/`. 

```bash
jupyter-nbconvert notebook.ipynb --to slides --reveal-prefix=../reveal.js 
```
