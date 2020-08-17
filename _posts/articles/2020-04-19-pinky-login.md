---
layout: post
title: "Eaton lab server guide"
author: Deren
categories: articles
excerpt: "New user setup"
comments: true
image:
  feature: header_ped.png
share: true
tags: [jupyter, pinky, conda, ssh]
date: 2020-04-19
---


# Connecting to pinky
This guide will walk you through the recommended steps to get set up 
for using the `pinky` server and for following shared use best practices. 

### 1. request access
Write to Deren to request a username and password to be setup 
for you on pinky. 


### 2. Create a GitHub account
If you don't yet have one, create an account. 


### 3. generate a public SSH key
<!-- You need a GitHub account.  -->
On your laptop run the command below to generate a private and public key
pair. This will request that you enter a passphrase, if you want you can just
hit enter to leave the passphrase blank. This will generate two files placed
in your `~/.ssh` folder. The private key stays on your laptop and the public key will be sent to pinky so that the two files can be matched up
when you try to connect. 
```bash
ssh-keygen -t rsa -b 4096 -C "deren@sacra"
```

### 4. upload your public SSH key to your GitHub account
Your public key can be shared publicly, and used for a variety of security
purposes. To ensure that you do not lose it I recommend uploading it to 
your GitHub account. Follow the instructions here: [https://jdblischak.github.io/2014-09-18-chicago/novice/git/05-sshkeys.html](https://jdblischak.github.io/2014-09-18-chicago/novice/git/05-sshkeys.html).
Once your key is uploaded send Deren an email with your GitHub 
username and he will pull your public key onto pinky so that you 
will be able to login.


### 5. setup your laptop for easy ssh login
Next edit your SSH config file on your laptop to create a shortcut name to 
reference the pinky server. This makes it so that you do not need to write
out the full IP address and username when you login. Replace the {username}
with your own name in lower case (e.g., deren) without brackets.
```bash
# nickname the server pinky (ENTER YOUR USERNAME w/o brackets)
touch ~/.ssh/config
echo -e "
Host pinky
    Hostname 128.59.23.200
    User {username}
" > ~/.ssh/config
```

Finally, you can now login to pinky from your terminal by just typing:
```bash
ssh pinky
```
