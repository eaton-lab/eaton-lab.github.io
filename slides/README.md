
### Presentations

+ china-2018: Slideshow of China trip photos and maps. 
+ 


# show docker images
docker images

# build docker image from Dockerfile
docker build -t dereneaton/reveal .

# Dockerfile 



### Build HTML reveal.js presentations by hand.

+ https://github.com/hakimel/reveal.js/  


### Build HTML reveal.js presentations from notebooks
cd into one of the slideshow directories and run *nbconvert* to build the 
presentation as slides. It will build index.slides.html.

```bash
jupyter-nbconvert notebook.ipynb --to slides --output index
```

### Build and serve the notebook slides locally
This will create index.slides.html and serve it on localhost.

```bash
jupyter-nbconvert notebook.ipynb --to slides --output index --post serve
```

### Hosting it on github
This will write the slides.html file with the path to the local version 
of reveal.js set (shown in the file tree at the top of page). I also 
rename the html file to index.html before pushing to github.

```bash
## writes slides
jupyter-nbconvert notebook.ipynb --to slides --reveal-prefix=../reveal.js --output index

## make an index
mv index.slides.html index.html
```

After pushing to github you can then view the slides at 
[http://github.com/eaton-lab.github.io/slides/notebook](http://github.com/eaton-lab.github.io/slides/notebook)


### Treefile for presentations
```
eaton-lab.github.io/  
|
+-- slides/
    +-- reveal.js/  
    |
    +-- slideshow_1/  
    |   +-- notebook_1.ipynb  
    |   +-- index.slides.html  
    |
    +-- slideshow_2/  
    |   +-- notebook_2.ipynb  
    |   +-- index.slides.html  
    |
    +-- slideshow_3/
        +-- index.html
        +-- images/
```  
