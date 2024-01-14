---
title: Get 4 PRs easily and usefully for the Hacktoberfest
description: You want to get involved into the Hacktoberfest an win a shirt or plant a tree? Follow your guide!
leafname: hacktobefest_4_prs_easily
link:
  label: Easy and ecological Hacktoberfest
  title: See how to complete the Hacktobefest easily
date: 2021-10-12T09:07:32.000Z
lang: fr
location: FR
keywords:
  - Hacktoberfest
  - NodeJS
  - NPM
  - Modules
categories:
  - Modules
---

# Complete the Hacktoberfest easily and usefully!

Well, I just finished my 4 PRs this year, and got a few questions on how to complete the Hacktoberfest for people that are not used to open-source development.

I have an easy trick to do so. NPM modules are in fact packages that should only contain the actual code, eventual mappings for built code and the `package.json` file.

Sadly, it is often not the case. It frequently contains a lot of contents that ain't supposed to be in the distributed code. It leads to wasted disk space and network bandwidth.

A simple yet useful way to contribute to the open-source community is to reduce the NPM modules size. To identify which modules needs your help, go to any of your NodeJS project and run the following command:

```sh
du -ch -d0 node_modules/*
```

To focus on the biggest modules, you can filter the output:

```sh
du -ch -d0 node_modules/* | grep M
```

Now we know which modules are too heavy. On the DiagRAMS Technologies API, the heaviest is `typescript` with 61Mb.

To browse the repository code, just run:

```sh
npm repo typescript
```

Now we can investigate, I think you should avoid big modules like TypeScript for your first PRs since it can be complicated to understand. Most heavy modules are not using the [files](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) field in their `package.json` file.

Once you could identify which files are required and which ain't, you can clone and fork the repository.

```sh
# Clone and install
git clone git@github.com:{my_username}/{my_fork}.git;
cd module;
npm i;

# Package the module and see its size

npm pack;
du -h my_fork-x.x.x.tgz

# Add the `file` field to the package.json

# Package the module again and check its new size

npm pack;
du -h my_fork-x.x.x.tgz

# Install the module in your projet and check
# it still works

cd my_project;
npm install my_fork-x.x.x.tgz;
npm test;

```

Your are now ready to submit your pull-request with the package size before and after your modifications!

**Simple, ecological and useful, mission accomplished!**
