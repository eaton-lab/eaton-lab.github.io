---
layout: post
title: "Login to HPC passwordless"
author: Deren
categories: articles
excerpt: "Save yourself 30 seconds every day."
comments: true
image:
  feature: header_ped.png
share: true
tags: [HPC, Server, Linux, SSH]
date: 2019-11-19
---

## Set up a shortcut to login by SSH
In a linux or OSX terminal you will have a hidden directory in HOME called `~.ssh`
which contains files for setting preferences or login credentials to make it simpler
and faster to login to remote systems. Let's start by setting a shortcut for 
the two clusters at Columbia in a file called `~.ssh/config`. The code below 
shows the typical longform SSH login command and the shorter version that we will
be able to use once you setup your config file.

```bash
# what you do now
ssh username@habanero.rcs.columbia.edu

# what you want to be able to do
ssh habanero
```

To setup the config file use a text editor like nano to create and edit the config
file by calling `nano ~/.ssh/config` and then enter the following being sure to 
**replace USERNAME with your actual username**. 

```bash
Host habanero
    Hostname habanero.rcs.columbia.edu
    User USERNAME

Host moto
    Hostname moto.rcs.columbia.edu
    User USERNAME
```

## Setup passwordless login
Great, now that we can call the command to login to the cluster more easily let's
also make it so that you do not need to enter a password. We can do this by sharing
SSH credentials between your laptop and the cluster. This is a two-step process. 

#### 1. Generate an SSH key 
Enter your email address here of course. This will prompt you to enter a password
for which you should enter the password you wish to use to login to the cluster
(you can set this to not ask later).
```bash
ssh key-gen -t rsa -b 4096 -C "user@email.org"
```

#### 2. Send SSH key to the HPC
Now we send the key to the cluster.
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub habanero
```

And repeat for the other cluster. 
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub moto
```

That's it. You should now be able to login more efficiently.