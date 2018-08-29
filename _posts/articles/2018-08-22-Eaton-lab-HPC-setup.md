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
cd ~
ln -s /rigel/dsi/users/<user> scratch-dsi
```

To transfer files from your local computer to the cluster you can use `scp`, 
or you can download data directly on the cluster if it is hosted online 
somewhere. 
```bash
# On your local computer
# transfer files or dirs from your local computer to the scratch space
scp <path-to-file-or-dir> <user>@habanero:/rigel/dsi/users/<user> 
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
Instead, you submit your jobs using a *job script* and this will take care of
reserving resources for your job and sending it to run on the proper *compute 
nodes*. 

First we'll make some directories to help ourselves stay organized; one 
directory for job scripts and one directory for log files, which store the 
output of running jobs. 
```bash
# On Habanero
cd ~
mkdir slurm-scripts/
mkdir slurm-logs/
```

#### Example job submission
We will begin by writing a SLURM job script. The header at the top of the 
file tells the scheduler the resources we need, which account to use ("dsi") 
and how the job and output files should be named. The scripts below the header
will be executed on compute node(s) once they are available. In the example below
we reserve one core (from a 24 core node) and run a simple `echo` command.
I name the file `dsi-helloworld.sh` and put it in the `slurm-scripts/` dir. 

```bash
# open file with nano text editor on Habanero
nano slurm-scripts/dsi-helloworld.sh
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
sbatch slurm-scripts/dsi-jupyter-1n.sh
```

Check whether it has started yet: 
```bash
# On Habanero
squeue -u <user>
```

Once it starts check your log files for instructions to connect: 
```bash
# On Habanero
cat log-files/<jobid>.log
```


#### Start a notebook server
https://jupyter-notebook.readthedocs.io/en/stable/public_server.html


Let's also create a password to connect to jupyter notebook. This is optional, 
if you don't set a password then a temporary _token_ will be generated when you
start a notebook which you can copy and paste. But setting a password that you 
can use persistently makes things a bit simpler. 
```bash
# On Habanero
jupyter-notebook --generate-config
jupyter-notebook password
```


```bash
#!/bin/sh
#SBATCH --account=dsi
#SBATCH --nodes=1    
#SBATCH --exclusive    
#SBATCH --time=5-00:00:00
#SBATCH --workdir=slurm-logs
#SBATCH --job-name=jupyter

## go home and unset XDG variable
cd $HOME
XDG_RUNTIME_DIR=""

## choose port and get IP of the compute node
ipnport='9999'
ipnip=$(hostname -i)

## print tunneling instructions to the log file
echo -e "
   Copy/Paste this in your local terminal to ssh tunnel with remote
   ----------------------------------------------------------------
   ssh -N -L $ipnport:$ipnip:$ipnport $user@habanero.rcs.columbia.edu                   
   ------------------------------------------------------------------

   Then open a browser on your local machine to the following address
   ------------------------------------------------------------------
   localhost:$ipnport (prefix with https:// if needed)
   ------------------------------------------------------------------
   "

## start the notebook 
jupyter-notebook --no-browser --ip=$ipnip --port=$ipnport
```

```bash
# output
   Copy/Paste this in your local terminal to ssh tunnel with remote
   ----------------------------------------------------------------
   ssh -N -L 9999:10.43.4.188:9999 deren@habanero.rcs.columbia.edu                    
   ------------------------------------------------------------------

   Then open a browser on your local machine to the following address
   ------------------------------------------------------------------
   localhost:9999  (prefix w/ https:// if using SSL cert/key)       
   ------------------------------------------------------------------
```   

### Waiting on the queue
The wait times on the queue can be pretty extreme, so waiting for a job to 
start so that you can work interactively in a notebook is not really ideal, 
at least until the size of the cluster improves dramatically. A better 
alternative can be to start your notebook on an interactive node, or on free, 
and then start an ipcluster instance as a queued job and connect to it from 
your notebook once it starts. More on that in another post. 

