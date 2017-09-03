---
layout: post
title: "Accessing sequence data for reproducible science"
author: Deren
categories: articles
excerpt: "The tools to download sequence data from SRA are clunky. I wrote a 
convenient Python wrapper to make it a bit easier."
comments: true
image:
  feature: header_ped.png
share: true
tags: [reproducibility, SRA, genomics, Python, ipyrad]
date: 2017-08-28
---


<h1 class="entry-subtitle">Diving into the SRA abyss</h1>
Access to data remains a major hurdle for reproducibility in science 
despite the increased availability of large-scale repositories for 
online data storage, and even journal policies that require data archiving.
In this post I'll try to make an argument for archiving data in the SRA through 
demonstration of the `sratools` wrapper from the `ipyrad.analysis` toolkit, 
which makes it easy and elegant to download data from the SRA 
when working in Python/Jupyter.

There are many reasons not to upload data to the SRA and to instead dump 
it on a generic archive like DRYAD, chief among them being that
uploading data to SRA is *super time-consuming and difficult*.
It requires entering pages upon pages of meta-data by hand into 
arcane web forms or spread-sheets to define numerous objects that 
are continually referenced by redundant names or prefix tags
(e.g., SUB, SAMN, SRX, SRP, PRJNA, BioSamples and BioProjects), 
and which have a relational structure that defies understanding
(e.g., 1 SRA can have 4 SRXs which produce data for 96 SRRs from
96 SRSs for 4 SRPs; See table below, which I reference frequently when
trying to understand this stuff.) And so it should be no surprise that
people often forgo data archiving.


| Prefix	| Accession Name	|   Definition	  
|:------------------| :-------------- | :--------------- |
| SRX  | *Experiment* | Metadata about library, platform, selection.    | 
| SRR  | *Run*        | **The actual sequence data for an experiment**. | 
| SRP  | *Study*      | Metadata about project (BioProject).            | 
| SRS  | *Sample*     | Metadata about the physical Sample (BioSample)  | 
| SRZ  | *Analysis*   | Mapped/aligned reads file (BAM) & metadata.     | 
| SRA  | *Submission* | Metadata of other 5 linked objects.             | 


<h1 class="entry-subtitle" 
  id="Why use the SRA" 
  href="Why use the SRA">
  Why use the SRA?
</h1>
The distinguishing advantage of using the SRA, however,
is that grouping data with its associated meta-data allows later users
to write scripts to access the data and properly format it for downstream
analyses based on the information encoded in the meta-data
(e.g., replicate samples are present from multiple lanes of sequencing, 
or paired reads need to be split into separate files). 
The idea of reusing genomic data seems obvious, but currently
seems less appreciated than for previous types of data like Sanger sequences, 
which have been fairly uniformly archived in Genbank. Perhaps this is 
because data generation has been highly incentivized over data reuse in recent years.

For the purpose of creating reproducible code for a published study, then,
the ideal example would include a single code block written at the 
beginning of a document to query and download all of the sequence data 
for a project while also providing information about the format of the data. 
This would be a huge advance over what is commonly available
today, which is typically just a verbal instruction to "go get the raw data"
from an accession ID before you start. Instead, reproducible code should 
itself include the necessary code (and software) to download the data 
and make it ready for downstream analysis.

<h1 class="entry-subtitle" 
  id="What about sra-tools" href="What about sra-tools">What about sra-tools?
</h1>

For several years there has been a proprietary tool developed by NCBI 
for this purpose, called 
[sra-tools](http://ncbi.github.io/sra-tools/).
Historically, I avoided using it because it was atrociously difficult to access
and install, and thus I didn't want to have to provide complex installation 
instructions at the beginning of my own documents just so users could 
download data from a link. *But*, now that it's 2017, like most good software 
the sra-tools package has become available through conda, 
making it easy enough for anyone to install and use. To install the sra-tools 
along with some associated tools for searching genome databases 
(called entrez-tools), simply run the following command with conda.

```bash
>>> conda install -c bioconda sra-tools
>>> conda install -c bioconda entrez-direct
```

The key program in `sra-tools` to download data from SRA is called `fastq-dump`.
And the main tool in `entrez-tools` is called `esearch`, which queries meta-data 
from NCBI. If you wanted to get the data from a single Run Accession (SRR)
you can download its fastq data with `fastq-dump` and the ID:

```bash
>>> fastq-dump SRR1754715
```

If you want to download data for an entire project, however, you need to
do some complex bash scripting. For example, below we query the "Study
accession" (SRP) to extract its metadata and from that 
we extract info using `efetch` and `cut` to grab just the 
"Run accessions (SRRs)". It is a bit convoluted just to get the SRRs 
associated with an SRP. 

```bash
>>> esearch -db sra -query SRP021469 | efetch --format runinfo | cut -d ',' -f 1
```

```yaml
 1
Run
SRR1754715
SRR1754720
SRR1754721
SRR1754722
SRR1754723
SRR1754724
SRR1754725
SRR1754726
SRR1754727
SRR1754728
SRR1754729
SRR1754730
SRR1754731
```

To pass the resulting SRRs to the `fastq-dump` command to be downloaded
you could write something like the following, which I've broken 
down into smaller bits so you can see what each call is doing
before piping to the next:

```bash
>>> esearch -db sra -query SRP021469 |      \  ## search SRA for SRP021469
      efetch --format runinfo |             \  ## parse the runinfo
      cut -d ',' -f 1 |                     \  ## split on ',' & grab 1st thing
      grep SRR |                            \  ## grab lines starting with 'SRR'
      xargs fastq-dump --gzip               \  ## run fastq-dump on all SRR #s
                       --outdir fastqs/     \  ## gzip compress & put into dir
```

<h1 class="entry-subtitle" 
  id="Complications" href="Complications">Complications
</h1>

By default this will name files according to their SRR accession IDs. 
To rename them you can pass in other names, or grab them from the SRP 
metadata, which often includes the taxonomic names and collection IDs. 
For example, to rename the files based on their original collection IDs we'll 
grab the 30th element from runinfo. The command below shows what this looks 
like for the example SRP accession.

```bash
>>> esearch -db sra -query SRP021469 | efetch --format runinfo | cut -d ',' -f 30
```

The following is printed to stdout:
```yaml
 30
SampleName
29154_superba
30556_thamno
41954_cyathophylloides
41478_cyathophylloides
39618_rex
40578_rex
38362_rex
35855_rex
33588_przewalskii
33413_thamno
32082_przewalskii
30686_cyathophylla
35236_rex
```

OK, so now we want to download the sequence data *and* rename the files
according to the ``SampleName`` info that we parse from the metadata.
I broke the command into two separate calls to simplify it a bit. 
We will pass the `--accession` flag to `fastq-dump` which
tells it we want to rename the file and as an argument to it
we provide the `SampleName`.

```bash
## store elements 1 & 30 into a string/list
>>> vars=$(esearch -db sra -query SRP021469 |  
           efetch --format runinfo |           
           cut -d ',' -f 1,30 |                  
           grep SRR)         

## pass each pair of elements to fastq-dump
>>> for var in $vars
    do
        SRR=$(echo $var | cut -d ',' -f 1);
        ACC=$(echo $var | cut -d ',' -f 2);
        fastq-dump $SRR --accession $ACC --outdir fastqs/ --gzip;
    done
```

We now have the resulting data files, success!
```bash
>>> ls -l fastqs/
```

```yaml
-rw-rw-r-- 1 deren deren  42M Feb 17 20:00 29154_superba.fastq.gz
-rw-rw-r-- 1 deren deren  86M Feb 17 20:00 30556_thamno.fastq.gz
-rw-rw-r-- 1 deren deren 136M Feb 17 20:01 41954_cyathophylloides.fastq.gz
-rw-rw-r-- 1 deren deren 128M Feb 17 20:02 41478_cyathophylloides.fastq.gz
-rw-rw-r-- 1 deren deren  50M Feb 17 20:03 39618_rex.fastq.gz
-rw-rw-r-- 1 deren deren 100M Feb 17 20:04 40578_rex.fastq.gz
-rw-rw-r-- 1 deren deren  82M Feb 17 20:05 38362_rex.fastq.gz
-rw-rw-r-- 1 deren deren  84M Feb 17 20:06 35855_rex.fastq.gz
-rw-rw-r-- 1 deren deren  61M Feb 17 20:06 33588_przewalskii.fastq.gz
-rw-rw-r-- 1 deren deren  40M Feb 17 20:06 33413_thamno.fastq.gz
-rw-rw-r-- 1 deren deren  58M Feb 17 20:07 32082_przewalskii.fastq.gz
-rw-rw-r-- 1 deren deren  80M Feb 17 20:08 30686_cyathophylla.fastq.gz
-rw-rw-r-- 1 deren deren 108M Feb 17 20:09 35236_rex.fastq.gz
```

<h1 class="entry-subtitle" 
  id="Problems with this approach" href="Problems with this approach">Problems with this approach
</h1>

*It's not very clear/readable*  
If your goal is simply to attain a few fastq files it really seems like overkill 
to have to install a large suite of tools and then write a large complicated 
script that pipes the tools together just to download a few files from online. 
A simple `wget` command could likely this in one line. While it is nice to have 
the meta-data available, this approach does not make the meta-data 
very easy to read.

*The download location is hard-coded*  
A *very annoying* aspect of the sra-tools is that it downloads files in `.sra` 
format first and then converts from that format into `.fastq` fiels. 
The reason for this is to avoid errors in the download if it interrupted. 
But *crazy* enough it actually downloads these large sra files into
a new directory that it creates in `/home/user/ncbi/` without telling you that it's
doing it, and then it *leaves* these multiple GB size files behind in that 
directory. *Crazy*. This is most troublesome when working on HPC machines where your
home directory may not even have sufficient space to temporarily hold these files.
Changing the location to another directory, like a scratch space, is not at all
easy, and requires using *another* tool from sra-tools called `vdb-config`. 
It's ugly, really ugly, and one of the reasons I became interested in 
developing a better way. 

<h1 class="entry-subtitle" 
  id="A simpler (Pythonic) way?" href="A simpler (Pythonic) way?">A simpler (Pythonic) way?
</h1>

I do almost all of my work these days in Jupyter notebooks, and so I aimed
to write a simple wrapper around sra-tools + entez-tools that would 
function in a Pythonic way, and overcome some of the problems listed above. 
This tool is available through conda and distributed with the ipyrad analysis
toolkit. 

```bash
## install ipyrad and associated tools
>>> conda install -c ipyrad ipyrad
>>> conda install -c eaton-lab toytree
```

First import the ipyrad analysis tools (renamed as `ipa`) and then initiate 
an sratools object with a Study accession ID (SRP). 
You can also provide an argument for "workdir" which is the location 
where your fastq files (and temporary .sra files) will be downloaded to, 
and which will be created if it doesn't yet exist. 

```python
## import ipyrad analysis tools
>>> import ipyrad.analysis as ipa

## initalize an sratools object
>>> sra = ipa.sratools(accession="SRP021469", workdir="rawdata")
```

By providing just the SRP ID you can now query information about the 
study and have it returned as a nice DataFrame. Below I request fields 
1,4,6,29, and 30. The result is returned as a Pandas DataFrame object
which is easy to read and manipulate. From these fields you can see the 
Run IDs, the number of reads (spots), the fact that the data are 
single-end (i.e., no "spots with mates"), the ScientificNames and the 
SampleName provided by the study authors. 

```python
## view meta-data for all fields or a subset of fields
>>> sra.fetch_runinfo((1,4,6,29,30))
```

```yaml
           Run    spots spots_with_mates                ScientificName              SampleName  
0   SRR1754715   696994                0           Pedicularis superba           29154_superba  
1   SRR1754720  1452316                0       Pedicularis thamnophila            30556_thamno  
2   SRR1754721  2199613                0  Pedicularis cyathophylloides  41954_cyathophylloides  
3   SRR1754722  2199740                0  Pedicularis cyathophylloides  41478_cyathophylloides  
4   SRR1754723   822263                0               Pedicularis rex               39618_rex  
5   SRR1754724  1707942                0               Pedicularis rex               40578_rex  
6   SRR1754725  1391175                0               Pedicularis rex               38362_rex  
7   SRR1754726  1409843                0               Pedicularis rex               35855_rex  
8   SRR1754727  1002923                0       Pedicularis przewalskii       33588_przewalskii  
9   SRR1754728   636625                0       Pedicularis thamnophila            33413_thamno  
10  SRR1754729   964244                0       Pedicularis przewalskii       32082_przewalskii  
11  SRR1754730  1253109                0      Pedicularis cyathophylla      30686_cyathophylla  
12  SRR1754731  1803858                0               Pedicularis rex               35236_rex
```

To download the data now you simply need to use the `.run()` command. 
As with all other tools in the `ipyrad.analysis` toolkit existing files
with the same name will not be overwritten unless you use the `force=True`
argument, and the work can be optionally parallelized by providing an 
ipyparallel Client object as an argument (`ipyclient=`; see 
ipyrad docs for more details). 
If the data are paired-end they will be automatically split into separate files
for R1 and R2. You can indicate the field you wish to use for file 
names with the `name_fields=` argument, or provide multiple fields to name
files with multiple values. For example, to name files by their ScientificName
\+ Run ID separated by an underscore we would run the following, which will 
print a progress bar while it runs:

```python
>>> sra.run(name_fields=(30,1), name_separator="_")
```

```yaml
[####################] 100%  Downloading fastq files | 0:02:53 |  
13 fastq files downloaded to /home/deren/rawdata
```

And you can see the files were written to the proper location and 
renamed as we wished. 
```bash
>>> ls -lthr rawdata/
```
```yaml
total 1.1G
-rw-rw-r-- 1 deren deren  42M Aug 28 19:10 29154_superba_SRR1754715.fastq.gz
-rw-rw-r-- 1 deren deren  51M Aug 28 19:10 39618_rex_SRR1754723.fastq.gz
-rw-rw-r-- 1 deren deren  61M Aug 28 19:10 33588_przewalskii_SRR1754727.fastq.gz
-rw-rw-r-- 1 deren deren  85M Aug 28 19:11 35855_rex_SRR1754726.fastq.gz
-rw-rw-r-- 1 deren deren  59M Aug 28 19:11 32082_przewalskii_SRR1754729.fastq.gz
-rw-rw-r-- 1 deren deren  41M Aug 28 19:11 33413_thamno_SRR1754728.fastq.gz
-rw-rw-r-- 1 deren deren 129M Aug 28 19:11 41478_cyathophylloides_SRR1754722.fastq.gz
-rw-rw-r-- 1 deren deren 101M Aug 28 19:12 40578_rex_SRR1754724.fastq.gz
-rw-rw-r-- 1 deren deren  80M Aug 28 19:12 30686_cyathophylla_SRR1754730.fastq.gz
-rw-rw-r-- 1 deren deren  86M Aug 28 19:12 30556_thamno_SRR1754720.fastq.gz
-rw-rw-r-- 1 deren deren 109M Aug 28 19:12 35236_rex_SRR1754731.fastq.gz
-rw-rw-r-- 1 deren deren  82M Aug 28 19:12 38362_rex_SRR1754725.fastq.gz
-rw-rw-r-- 1 deren deren 136M Aug 28 19:12 41954_cyathophylloides_SRR1754721.fastq.gz
```

Et voilà. A huge benefit of this approach is actually hidden under the hood, 
which is that it automatically temporarily sets the location for the `.sra`
files to be downloaded to the "workdir" location, and we remove them right 
after they are converted into .fastq files. Therefore you will never run 
into problems with hidden sra files filling up your drive space, as is often 
the case with sra-tools.

Another strength of this approach is that you can clearly see and show 
the full meta-data from which the files are being drawn, nicely displayed 
as a Pandas DataFrame. This is a great thing to stick right at the beginning of
a reproducible science document, like a Jupyter-notebook, to show exactly where
your data came from and how you renamed the files.


