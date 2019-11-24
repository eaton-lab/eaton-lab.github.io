---
layout: post
title: "Assembling a plant genome on google cloud"
author: Deren
categories: articles
excerpt: "gsutils, buckets, instances."
comments: true
image:
  feature: header_ped.png
share: true
tags: [HPC, google, gcloud, Server, Linux, SSH]
date: 2019-11-24
---


### Assembling a plant genome with nanopore data
Our goal is to assemble a genome for the flowering plant *Pedicularis cranolopha*. We originally estimated the genome size to be 1-2Gb and generated \~180Gb of Illumina PE 150bp reads, 250Gb of nanopore reads (avg. read len \~30Kb) and \~350Gb of PE 150bp Illumina Hi-C data in addition to XXGb of RNA-seq data for genome annotation. Here I will focus on how we setup a google cloud instance for genome assembly using *canu* and *shasta*. 


### Setup a google cloud computing project
Log into [https://console.cloud.google.com/](https://console.cloud.google.com/) to create a free account (you may be eligible for free academic credits). Then create a new project. Ours is called "liuliu". My postdoc Jianjun Jin who is leading the bioinformatics for this project also created a personal account and I added him under the IAM section as a project "owner" to have full permissions.


### Create a storage bucket 
gs storage buckets are convenient for storing data long term as well as for transfering files between different locations. I backed up all of our data onto a bucket which takes up about 500Gb of space. You can create a bucket from the dropdown toolbar in the upper left corner: find "storage", then "storage" again to open the bucket storage page. There you can create a new bucket or modify existing buckets to set access rights. The bucket with our genome data is called "liuliu". This is where we will store the raw data. 


### Setup `gcloud` and `gsutil` to transfer data to gcloud
I followed instructions from here to install and setup the gsutil tool on my local computer where the raw data is saved: [https://cloud.google.com/storage/docs/gsutil_install#linux](https://cloud.google.com/storage/docs/gsutil_install#linux). The init command allows you to securely connect to gcloud using google authenticator in your browser. 

```bash
# Enter the following at a command prompt:
curl https://sdk.cloud.google.com | bash

# Restart your shell:
exec -l $SHELL

# Run gcloud init to initialize the gcloud environment:
gcloud init
```

### Copy data to the bucket 
Once you are logged in you can see the available buckets visible to your account using the following command on your local machine:
```bash
gsutil ls -l
```

And then transfer local files to the cloud bucket using the `cp` command on your local machine: 
```bash
gsutil cp file.txt gs://liuliu
```


### Create a hard disk on gcloud
A persistent disk can be used like a scratch drive on an HPC system to store processed data such as temporary files created during the genome assembly. According to the canu documentation you should have \~3 Tb of free disk space for a mammal or human-sized genome, but up to 10-20Tb for a highly repetitive genome such as a plant. Our genome size is estimated to be smaller than human (\~1G) and not particularly repetitive (\~2%) based on kmer statistics, so I created a 6Tb disk to be safe. When finished with the assembly we will transfer the long-term data files back to the storage bucket and delete disk. The disk was created by selecting from the toolbar "Compute Engine" and then "disks" and I named it "scratch". 


### Starting an instance and format the scratch disk
I created an instance (named assembly) in project liuliu that boots an Ubuntu 19.04  from a 10Gb disk and has the 6Tb 'scratch' disk attached containing the raw data. The instance (for now) is 32vCPUs and 120Gb of disk. This seems like a reasonable amount of resources for our initial analyses with *canu*, which requires only about 16Gb per node. We will want more RAM for later *shasta* assembly, and we can stop and edit the instance at any time later to change the resources. 

Once the instance has started I then connect to it with SSH. I followed instructions to format and mount the scratch disk on the compute instance [here](https://cloud.google.com/compute/docs/disks/add-persistent-disk?hl=en_US&_ga=2.182920166.-1380307473.1566255256#formatting). 

```bash
# on the assembly instance
sudo mkfs.ext4 -m 0 -F -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/sdb
sudo mkdir -p /scratch
sudo mkdir -p /scratch
sudo mount -o discard,defaults /dev/sdb /scratch/
sudo chmod a+w /scratch

# set to re-attach on restart of instance
sudo cp /etc/fstab /etc/fstab.backup
echo UUID=`sudo blkid -s UUID -o value /dev/sdb` /scratch/ ext4 discard,defaults,nofail 0 2 | sudo tee -a /etc/fstab
```

### Transfer raw data to the scratch disk
Copied from the bucket to the scratch dir for faster i/o access. 
```bash
gsutil -m cp -r gs://liuliu/2019-11-15-Liuliu-shasta/ .
```

### Install canu from source
To install *canu's* dependencies and ensure binaries are accessible to all users I installed *canu* into the `/opt/conda/bin` directory. 

```bash
# install conda in /opt/ so it is available to all users
cd
sudo bash Miniconda3-latest-Linux-x86_64 -p /opt/conda -b

# activate conda in path so that dependencies are found (e.g., java).
source /opt/conda/bin/activate
conda init
exec -l $SHELL

# install with conda
sudo conda install canu=1.9 -c bioconda -c conda-forge
```


### Clean and trim nanopore reads with canu
This is what we plan to run first (do we need to run the correct and trim steps multiple times?). Then we will probably try a fast shasta assembly of the trimmed and cleaned reads. Then if that goes well we will start a canu assembly as well. The shasta assembly will probably require changing the instance to a high mem node.


```bash
/opt/conda/bin/canu -correct \
  -p liuliu \
  -d /scratch/canu-assembly/ \
  genomeSize=1g \
  correctedErrorRate=0.12 \
  corMaxEvidenceErate=0.15 \
  minReadLength=1000 \
  minOverlapLength=500 \
  -nanopore-raw /liuliu/2019-11-15-Liuliu-shasta/S3*.fastq
```


```bash
/opt/conda/bin/conda -trim \
  -p liuliu \
  -d /scratch/canu-assembly/ \
  genomeSize=1g \
  correctedErrorRate=0.12 \
  corMaxEvidenceErate=0.15 \
  minReadLength=1000 \
  minOverlapLength=500 \
  -nanopore-raw /liuliu/2019-11-15-Liuliu-shasta/S3*.fastq 
```


### Canu tips for plant genomes
[For repetive genomes](https://canu.readthedocs.io/en/latest/faq.html#my-genome-is-at-or-gc-rich-do-i-need-to-adjust-parameters-what-about-highly-repetitive-genomes) such as plants do this in canu:
`corMaxEvidenceErate=0.15`

[What can be tweaked in canu](https://canu.readthedocs.io/en/latest/faq.html#what-parameters-can-i-tweak) 

For high coverage data this makes it faster:
`correctedErrorRate=0.12`

Discard short reads (default=1000).
`minReadLength=10000` 

Don't look for overlaps shorter than 500bp (default=500)
`minOverlapLength=500bp`



### IN PROGRESS ...


### Install shasta from source
For best performance build it on the machine (instance) that we plan to use for the assembly (high memory node instance). This takes about 10 minutes to 
install: https://chanzuckerberg.github.io/shasta/BuildingFromSource.html
Or, to build a version that is transferrable between machines add the following flag to the cmake call: `-DBUILD_NATIVE=OFF`. 

