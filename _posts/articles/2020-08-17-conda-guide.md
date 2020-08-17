---
layout: post
title: "Conda guide (updated)"
author: Deren
categories: articles
excerpt: "Updated conda workflow"
comments: true
image:
  feature: header_ped.png
share: true
tags: [jupyter, pinky, conda]
date: 2020-08-17
---


### Updated conda installation instructions
Conda is a work in progress, and the best practices evolve quickly. This is 
my current recommended best practice, aimed at avoiding conflicts among 
packages, and preventing the need for total reinstallations. 


### Fresh installation 
Download the latest Miniconda3 and install into your home directory.

```bash
# download latest 64-bit Py3 installation
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```

```bash
# install in batch mode
bash Miniconda3-latest-Linux-x86_64 -b 
```

If conda is not yet in your path (e.g., this is your first time installing)
then add it your path by calling:
```bash
~/miniconda3/condabin/conda init
```

### Create a working environment
It is best not to install additional packages into your base environment. 
Instead, create one or more environments. I'll create an environment using 
Python 3.7 since 3.8 is not yet widely supported. 

```bash
conda create -n py37 Python=3.7
```

```bash
conda activate py37
```

### Add conda-forge as your *constant* default channel
Remember that the order in which you list channels is important, since the 
they are checked in order to choose priority. It is best to install all packages from the same channel as much as possible to reduce conflicts. 
Conda-forge is the most expansive channel that also has the latest updates. 
Even if you need to install a package that is on bioconda, it is best to list
conda-forge *before* bioconda so that any dependencies of the bioconda package will be pulled in from conda-forge. 


```bash
conda config --add channels conda-forge
conda config --set channel_priority true
```


### Installation of local software

When you are doing development you often want to install software locally
with pip so that you can incorporate changes in your code instantly into your
development environment. I recommend doing this with the option `--no-deps` like below to ensure you do not accidentally install dependencies with pip, 
since this can cause conflict problems. Here is an example with `ipyrad` 
cloned from github.

```bash
# install ipyrad from conda to get all dependencies
conda install ipyrad -c conda-forge -c bioconda

# clone the ipyrad repo to get git development version
git clone https://github.com/dereneaton/ipyrad.git

# cd into the repo
cd ipyrad/

# do local pip install (-e) with --no-deps 
pip install -e . --no-deps
```
