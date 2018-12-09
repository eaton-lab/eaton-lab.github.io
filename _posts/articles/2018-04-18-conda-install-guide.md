---
layout: post
title: "Conda installation guide for multiple kernels"
author: Deren
categories: articles
excerpt: "Setting up Py2, Py3, R, Julia, bash, and RevBayes kernels"
comments: true
image:
  feature: header_ped.png
share: true
tags: [conda, jupyter, python, kernels]
date: 2018-08-26
---

<hr>

#### Why conda?
The Conda software manager is a powerful tool for installing and managing
scientific software. It has become somewhat of a standard for setting up 
reusable and portable software environments that can shared with others and 
easily recreated across computers. As a developer it is particulary useful
for testing sotware in multiple environments before deploying. Some the 
other advantages of using conda are listed below:

+ Create fresh environments to install into (avoid system conflicts).  
+ Create separate "sandboxed" environments (avoid conflicts among environments).
+ Install software locally (easy to remove or update w/o needing administrator).
+ Test among different environments (e.g., Py2 and Py3)
+ Share environments for others to reproduce. 

#### This post (our goal)
Here I've listed instructions for installling a py2/py3 kernel stack on a Linux 
machine (e.g., HPC cluster) to make both languages available. 

<!-- the following 5 languages available: 
Python2, Python3, R, Julia, and RevBayes. I'll also try to explain
as we go what each step of the installation is doing. More directly, our goal 
is to be able to spin up a jupyter notebook like in the GIF below and select 
from a list of kernels (languages) to run in the notebook, and to be able to 
update and install new packages into each of these environments. 

[GIF here.]
 -->

#### Installing conda
I recommend installing miniconda, the bare-bones version of conda that includes 
only the necessary software to make conda work. Once conda is installed you can 
use it to install any other software that you want. 

I have installed conda many times on many systems, often with multiple kernels, 
and from this experience I've learned a few useful tricks. My installation 
instructions may differ slightly from others you will find online; this is partly because the conda installation procedure has changed rapidly in recent years, and also because most tutorials only describe the simplest installation approach. My instructions are for the latest conda versions as of late 2018, and are somewhat complex as they are aimed towards users who wish to install multiple kernels. 

<!-- If you are working on HPC you may frequently use a system-wide version of 
anaconda that was installed by your administrator. For many purposes this
will be sufficient. However, when using the system-wide software you are likely
to run into limitations and that is why I recommend installing your own stack.
My philosophy is that the purpose of conda is to give *you* control over your
software, so that you don't need to rely on an administrator. 
Disk space is cheap.

I recommend installing miniconda3 (your base env will use Python 3), even if 
you do most of your coding in Python2. The way we will set up our conda 
installation it will be easy to switch between the two, and since Python 3 
is newer/better, you might as well use it for your base environment. 

 -->
##### Conda installation instructions (for Linux)
```bash
# For LINUX -- get the latest miniconda3 64-bit installer.
wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3-installer.sh

# run batch installer
bash ~/miniconda3-installer.sh -b

# add conda to the PATH variable in your startup file (.bashrc)
echo 'PATH=$HOME/miniconda3/bin:$PATH; export PATH' >> ~/.bashrc
source ~/.bashrc
```

##### What is conda
You now have the `conda` binary installed which can be used to find and install
other software. You also have a default location where your new software will 
be installed, which is in your miniconda3/ directory. You also have a default 
environment where that software will be grouped into, called `base`. So far 
this environment only has Python3 and a few other Python packages installed. 
You can check your conda installation by using the commands `conda info`, or
see the software installed in your environment with `conda list`. 


##### Install ipython, jupyter, ipyparallel in base env
```bash
conda install ipython jupyter ipyparallel -y
```

##### Installing kernels
Here's another trick. I don't install much into the `base` conda environment. 
Instead, I create a Python3 and Python2 environment and give explicit names to 
each. Then when I install any subsequent software I always designate using the
`-n` argument to `conda install` which environment I wish to install into. 

Let's create a Python2 environment and name it py27:
```bash
conda create -n py27 python=2 notebook ipykernel -y
source activate py27
ipython kernel install --user --display-name "Python 2.7"
source deactivate
```

```bash
# Installed kernelspec py27 in /home/deren/.local/share/jupyter/kernels/py27
```

### Install software into your Python environments

```bash
conda install numpy scipy pandas -n base -y
conda install toytree -c eaton-lab -n base -y
```

```bash
conda install numpy scipy pandas -n py27 -y
conda install toytree -c eaton-lab -n py27 -y
```
<!-- 
### Install additional kernels

#### bash kernel (IPython based)
The bash kernel can be useful for when you're teaching basic bash scripting, 
or even for writing installation instructions or posts like this one. You can 
always call bash code from an IPython kernel, but there may be instances where
you plan to write only bash code and then it is a bit cleaner looking to just 
install a bash kernel. So here it is:

```bash
conda activate base
conda install cython twisted -y
pip install bash_kernel
python -m bash_kernel.install
```

#### RevBayes kernel 
```bash
# install revbayes locally (into miniconda dir)
conda create -n revbayes
conda activate revbayes
conda install revbayes_jupyter -c eaton-lab
python -m revbayes_kernel.install

## make revBayes callable as a kernel.
pip install metakernel
mkdir ~/local/
cd ~/local/
git clone https://github.com/revbayes/revbayes_kernel.git
python setup.py install
python -m revbayes_kernel.install
```

#### R kernel (IRkernel)
This command will install a new separate version of R from the version that you might otherwise have on your machine. This is my preferred way to do things since I like to be able to easily remove my software, or recreate an environment very easily. And so if I need to test some code from a fresh install I can just spin up a fresh R environment in conda and install new R packages into it for testing. You can check that the version of R in the front of your PATH variable (the one that will be used by default) is the miniconda version by typing `which R`. If you leave the R environment that we've created then it will revert back to your system-wide R. Thus, this version of R will not conflict with your other version ever. 

Installing R into conda may seem like a weird concept, but if you've ever run 
into problems installing R packages because out updates to R versions you'll 
recognize that being able to create environments with different R versions and 
packages can be quite convenient. And by isolating this version of R and its 
packages into a conda environment you can ensure that it will not interfere with
any other version of R that you might using on the same system. 

```bash
conda create -n r
conda install -c r -n r r-essentials 
source activate r
R -e "install.packages(c('repr', 'IRdisplay', 'evaluate', 'crayon', 'pbdZMQ', 'devtools', 'uuid', 'digest'))"
R -e "devtools::install_github('IRkernel/IRkernel')"
R -e "IRkernel::installspec()"
```

To install R packages you can use commands from within R, such as `install.packages`
or `devtools`, as shown above, or you can use simple conda commands as shown below.

```bash
conda install -n R -c r r-ape r-phytools
```
 -->

### Cleanup
To save space you may want to remove all of the downloaded package files for the
software conda installed. You can do this with the command below. 

```bash
conda clean --all -y
```

### Removing/uninstalling conda 
If you decide that you're not down with conda, or you want to remove all of 
your software and start fresh, you can do this easily with conda. The command
to remove your conda environment simply involves removing the directory where
miniconda is installed. Be careful here that you write the correct path name 
when using the `rm` command. If you installed multiple kernels then you will
also want to remove the `.conda` and `.local/share/jupyter/kernels` dirs since
these hold the references to those kernel names. 

```bash
# if you want to remove miniconda
rm -rf ~/miniconda3/
rm -rf ~/.conda
rm -rf ~/.local/share/jupyter/kernels
```

