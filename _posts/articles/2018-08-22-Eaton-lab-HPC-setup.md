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
date: 2018-08-22
---

<hr>

#### Columbia HPC resources
There HPC resources at Columbia are rapidly being developed and expanded
and this post will be updated as things change. Currently the main cluster 
available to researchers is called *Habanero*, but in 2019 a new cluster
called Terremoto will become available as well. The Eaton-lab has bought 
reserved resources on Terremoto, but until those are ready we only have access
to shared resources on Habanero. This includes the "free" partition -- 
which provides too few resources for genomics work -- and the "dsi" partition, 
which we have access to through Deren's affiliation with the Data Science 
Institute at Columbia. In this partition Eaton lab members have access to 8Tb 
of scratch space and about 20 24-core nodes, with a max walltime of 5 days 
(or 6 hours on the free partition).


### Connecting to Habanero  
The full documentation for the Habanero cluster can be found here ([Habanero Documentation](https://confluence.columbia.edu/confluence/display/rcs/Habanero+HPC+Cluster+User+Documentation)). 
To connect to Habanero use SSH and your UNI credentials. 
```bash
# On your local computer
ssh <user>@habanero.rcs.columbia.edu
```

### Setup your scratch directory
As an Eaton-lab member you will have access to the DSI partition. Here you will
have 8Tb of scratch space. Start by creating a scratch directory in the DSI 
partition named with your UNI. This is where you can store large data files. 

```bash
# On Habanero
# make a directory in the scratch space
mkdir /rigel/dsi/users/<user>

# make a symlink from your home dir
ln -s /rigel/dsi/users/<user> ~/scratch-dsi
```

To transfer files from your local computer to the cluster you can use `scp`, 
or you can download data directly on the cluster if it is hosted online 
somewhere. 
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
Habanero uses the SLURM job submission system to manage shared resources on the 
cluster. When you login you will be connected to the *head* node, which is 
simply a landing pad. You should not run any intensive tasks on this node. 
Instead, submit your jobs using a *job script* to take care of reserving resources for your job and sending it to run on a *compute node*. 

First we'll make some directories to help ourselves stay organized; one 
directory for job scripts and one directory for log files, which store the 
output of running jobs. 
```bash
# On Habanero
mkdir ~/slurm-scripts/
mkdir ~/slurm-logs/
```

--------------------------------------------------


#### Example job submission
The header at the top of the file tells the scheduler the resources we need, which account to use ("dsi") and how the job and output files should be named. The scripts below the header will be executed on compute node(s) once they are available. In the command below we reserve one core and simply execute the `echo` command to print text to the output. I name the file `dsi-helloworld.sh` and put it in the `slurm-scripts/` dir. 

```bash
# open file with nano text editor on Habanero
nano ~/slurm-scripts/dsi-helloworld.sh
```

```bash
#!/bin/sh
#SBATCH --account=dsi
#SBATCH --cores=1    
#SBATCH --time=5:00
#SBATCH --workdir=slurm-logs
#SBATCH --job-name=hello

echo "hello world"
```

Submit the job to the scheduling queue. 
```bash
# On Habanero
sbatch ~/slurm-scripts/dsi-jupyter-1n.sh
```

Check whether it has started yet: 
```bash
# On Habanero
squeue -u <user>
```

Once it starts check your log files for the output:
```bash
# On Habanero
cat ~/slurm-logs/<jobid>.log
```

------------------------------------------------

#### Start a notebook server
I do most of my work on jupyter notebooks which also provide a really nice way 
to connect and work interactively on compute nodes. To start a notebook server
let's start by generating a config file and a password. This is optional -- 
if you don't set a password then a temporary _token_ will be generated when you
start a notebook -- but setting a password makes connecting a bit simpler. 
```bash
# On Habanero
jupyter-notebook --generate-config
jupyter-notebook password
```

Next let's write a job submission script to start a notebook server. In the example below we reserve one entire node (all 24 cores by asking --exclusive). We also designate a specific port and IP to run the notebook server from. The port can be any number between 8000-9999, it is easiest if you just pick your favorite number and use it all the time. I typically use 8888 for notebooks I run locally and 9999 for notebooks I connect to remotely. The IP/hostname of the compute node is generated by the command `hostname` in the script. 

```bash
# On Habanero create another job script
nano ~/slurm-scripts/dsi-jupyter-1n-5d.sh
```

```bash
#!/bin/sh
#SBATCH --account=dsi
#SBATCH --nodes=1    
#SBATCH --exclusive    
#SBATCH --time=5-00:00:00
#SBATCH --workdir=slurm-logs
#SBATCH --job-name=jupyter

## unset XDG variable (required when running jupyter on HPC)
XDG_RUNTIME_DIR=""
jupyter-notebook --no-browser --ip=$(hostname) --port='9999'
```

Submit the job:
```bash
# On Habanero
sbatch slurm-scripts/dsi-jupyter-1n-5d
```

Check if the job has started, and take note of the `hostname` of the node it has connected you to.  
```bash
# On Habanero
squeue -u <user>
```

Once it starts you can connect your local computer to the notebook server running on the compute node by creating an SSH tunnel. Run the command below from your local machine, **substituting in the hostname of the node that you connected to** in place of the name `node210`. Once executed, leave this terminal window open and minimize it into the corner. You can just leave it for as long as you want to maintain the tunnel connection.
```bash
## On your local computer
ssh -N -L 9999:node210:9999 deren@habanero.rcs.columbia.edu
```

Now open a browser on your local computer (e.g., laptop) and enter the address `localhost:9999`


### Waiting on the queue
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
```

### Interactive mode
If you only plan to do a very small amount of work it is better to just jump into
an interactive session rather than submit a job to start a notebook server or to 
request many resources. This type of job will usually start quickly.

```bash
# ask for 30 min interactive session
srun --pty -t 30:00 --account=dsi /bin/bash
```

