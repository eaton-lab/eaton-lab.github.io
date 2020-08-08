---
layout: post
title: "Eaton-lab HPC instructions"
author: Deren
categories: articles
excerpt: "Notes on using Columbia HPC resources for Eaton lab members."
comments: true
image:
  feature: header_ped.png
share: true
tags: [conda, jupyter, HPC, python, Columbia, Habanero, Terremoto]
date: 2018-12-09
---

<hr>

#### Columbia HPC resources
We have access to both the *Terremoto* and *Habanero* clusters. 
Documentation for Terremoto is [here](https://confluence.columbia.edu/confluence/display/rcs/Terremoto+HPC+Cluster+User+Documentation), and Habanero [here](https://confluence.columbia.edu/confluence/display/rcs/Habanero+HPC+Cluster+User+Documentation)). On Habanero
Eaton lab members have access to 8Tb of scratch space and about 20 24-core nodes,
but these resources are shared and often busy. On Terremoto we have one
reserved 24 core node and 6Tb of scratch space, and can access all other shared
resources. On both clusters the max walltime is 5 days 
(or 6 hours on the free partition, or 12 hours on the short partition).


### Connecting by SSH
Use SSH from a terminal and your UNI credentials to login. 
```bash
# Connect to habanero from your local computer
ssh <user>@habanero.rcs.columbia.edu

# OR, connect to terremoto from your local computer
ssh <user>@moto.rcs.columbia.edu
```


### Setup your scratch directory
On Habanero you can access the "dsi" partition, on Terremoto use the "eaton" 
partition. You can create a user specific scratch directory in the the 
partition named with your UNI. This is where you should store large data files. 
If you think you will need to share the data with others then use the 'project'
space on Terremoto in the eaton directory.

```bash
# ON HABANERO
# make a directory in the scratch space
mkdir /rigel/dsi/users/<user>

# make a symlink from your home dir
ln -s /rigel/dsi/users/<user> ~/scratch-dsi

# ON TERREMOTO
# make a directory in the scratch space
mkdir /moto/eaton/users/<user>

# make a symlink from your home dir
ln -s /moto/eaton/users/<user> ~/scratch-user
ln -s /moto/eaton/projects ~/scratch-projects
```

To transfer files from your local computer to the cluster you can use `scp`, 
or you can download data directly on the cluster if it is hosted online 
somewhere. The two clusters do not share a disk space, unfortunately, so you 
cannot copy data to one and access it from the other. Better to choose one 
cluster for your project, probably moto. 
```bash
# On your local computer
# transfer files or dirs from your local computer to the scratch space
scp <path-to-file-or-dir> <user>@habanero.rcs.columbia.edu:/rigel/dsi/users/<user> 
```

<!-- 
### Install local software
Follow my [instructions coming soon post](...) for installing conda 
locally, and then use conda to install software. There is also system wide 
software available that you can look into, but meh. Unfortunately your home 
directory is only 10Gb which is not large enough to install many kernels into. 
If you plan to install a lot of software I would suggest installing conda into
your scratch space instead of home. If you only need one conda environment then
your home space should suffice. 
 -->

### Submit jobs to the cluster using SLURM
Both clusters use the SLURM job submission system to manage shared resources on the 
cluster. When you login you will be connected to the *head* node, which is 
simply a landing pad. You should not run any intensive tasks on this node. 
Instead, submit your jobs using a *job script* to take care of reserving 
resources for your job and sending it to run on a *compute node*. 

First we'll make some directories to help ourselves stay organized; one 
directory for job scripts and one directory for log files, which store the 
output of running jobs. 
```bash
# On the head node
mkdir ~/slurm-scripts/
mkdir ~/slurm-logs/
```

--------------------------------------------------


#### Example job submission
The header at the top of the file tells the scheduler the resources we need, which account to use ("dsi") and how the job and output files should be named. The scripts below the header will be executed on compute node(s) once they are available. In the command below we reserve one core and simply execute the `echo` command to print text to the output. I name the file `moto-helloworld.sh` and put it in the `slurm-scripts/` dir. 

```bash
# open file with nano text editor on the head node
nano ~/slurm-scripts/moto-helloworld.sh
```

```bash
#!/bin/sh
#SBATCH --account=eaton
#SBATCH --cores=1    
#SBATCH --time=5:00
#SBATCH --workdir=/moto/home/de2356/slurm-logs/
#SBATCH --job-name=hello

echo "hello world"
```

Submit the job to the scheduling queue. 
```bash
# On the head node
sbatch ~/slurm-scripts/moto-helloworld.sh
```

Check whether it has started yet: 
```bash
# On the head node
squeue -u <user>
```

Once it starts check your log files for the output:
```bash
# On the head node
cat ~/slurm-logs/<jobid>.log
```

------------------------------------------------

#### Start a notebook server
I do most of my work on jupyter notebooks which also provide a really nice way 
to connect and work interactively on compute nodes. To start a notebook server
let's start by generating a config file and a password. This is optional -- 
if you don't set a password then a temporary _token_ will be generated when you
start a notebook -- but setting a password makes connecting a bit simpler. You 
will of course need to have jupyter installed already.
```bash
# On the head node
jupyter-notebook --generate-config
jupyter-notebook password
```

Next let's write a job submission script to start a notebook server. In the example below we reserve one entire node (all 24 cores by asking --exclusive). We also designate a specific port and IP to run the notebook server from. The port can be any number between 8000-9999, it is easiest if you just pick your favorite number and use it all the time. I typically use 8888 for notebooks I run locally and 9999 for notebooks I connect to remotely. The IP/hostname of the compute node is generated by the command `hostname` in the script. 

```bash
# On the head node
nano ~/slurm-scripts/moto-jupyter-1n-1d.sh
```

```bash
#!/bin/sh
#SBATCH --account=eaton
#SBATCH --nodes=1    
#SBATCH --exclusive    
#SBATCH --time=1-00:00:00
#SBATCH --workdir=/moto/home/de2356/slurm-scripts/
#SBATCH --job-name=jupyter

## unset XDG variable (required when running jupyter on HPC)
cd $HOME
XDG_RUNTIME_DIR=""
jupyter-notebook --no-browser --ip=$(hostname) --port=9999
```

Submit the job:
```bash
# On the head node
sbatch slurm-scripts/moto-jupyter-1n-1d
```

Check if the job has started, and take note of the `hostname` of the node it has connected you to.  
```bash
# On the head node
squeue -u <user>
```

Once it starts you can connect your local computer to the notebook server running on the compute node by creating an SSH tunnel. Run the command below from your local machine, **substituting in the hostname of the node that you connected to** in place of the name `t103`. Once executed, leave this terminal window open and minimize it into the corner. You can just leave it for as long as you want to maintain the tunnel connection.
```bash
## On your local computer
ssh -N -L 9999:t103:9999 de2356@moto.rcs.columbia.edu
```

Now open a browser on your local computer (e.g., laptop) and enter the address `localhost:9999`


<!-- ### Waiting on the queue
The wait times on the queue can be pretty extreme, so waiting for a job to 
start so that you can work interactively in a notebook is not really ideal, 
at least until the size of the cluster improves dramatically. A better 
alternative can be to start your notebook on an interactive node, or on free, 
and then start an ipcluster instance as a queued job and connect to it from 
your notebook once it starts. More on that in another post. For jobs with a long
wait time it can be useful to set an email alert for when the job start. This
can be done with in the slurm script by adding:

```bash
#SBATCH --mail-type=ALL
#SBATCH --mail-user=de2356@columbia.edu
``` -->

### Interactive mode
If you only plan to do a very small amount of work it is better to just jump into
an interactive session rather than submit a job to start a notebook server or to 
request many resources. This type of job will usually start quickly.

```bash
# ask for 30 min interactive session
srun --pty -t 30:00 --account=dsi /bin/bash
```

