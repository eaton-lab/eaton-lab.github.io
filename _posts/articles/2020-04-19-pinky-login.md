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


### Generate a public SSH key and upload to GitHub
For this you will need a GitHub account. On your laptop you will need to run
the command below to generate a private and public key pair. The private key
stays on your laptop and the public key will be placed on pinky so that they
can handshake when you try to connect. Follow instructions like [here](https://virtualzero.net/blog/how-to-add-an-ssh-public-key-to-github-from-Ubuntu-18.04-lts) but using the SSH-keygen command below (**and your own email address**). 

```bash
ssh-keygen -t rsa -b 4096 -C "UNI@columbia.edu"
```
Once your key is uploaded send Deren an email with your GitHub username and he will pull your public key onto pinky so that you will be able to login.


### Logging into pinky
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
