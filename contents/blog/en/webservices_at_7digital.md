---
title: Project Webservices at 7Digital
description: A sum-up of my last 6 months working at 7Digital.
leafname: webservices_at_7digital
link:
  label: Webservices at 7Digital
  title: A presentation of the architecture of the 7Digital Project's Webservices
  url: https://slides.com/nfroidure/projects-webservices-7digital
date: "2017-02-07T13:09:30.000Z"
lang: en
location: US
keywords:
  - 7Digital
  - JavaScript
  - web
  - services
  - Rest
  - HTTP
categories:
  - Web Services
---

# Project Webservices at 7Digital

A presentation I gave about the refactoring I made at 7Digital.

[Slides](https://slides.com/nfroidure/projects-webservices-7digital "🎚 See the presentation slides")

**Script of the presentation:**

## A bit of context

As you may have noticed, the project team at 7 Digital has a very different way to ship software than the product team.  
 Indeed, what make us working so differently is mainly timelines. We have to ship features on a regular basis in order to get feedback from our partners.

### Custom projects

Our customer projects require us to slightly change our webservices behavior. From custom APIs to third party integrations. We need to be able to build several custom platforms at the same time without degrading our service's quality.

### Transitioning

All of it has to be done gradually, implying a lot of backward compatibility considerations on an old codebase with no tests at all.

### Contractors

We also have to manage relationship with contractors and keep sure we can provide them the environment quick enough to be sure they won't be stuck on their working days.

### Project oriented

We're building projects over a product. It sometimes enforce us to implement features that will then ship into our core features.

## Modularization

To address our projects specificities we had to create an highly modular codebase thanks to a few common patterns.

### One repository per concern

First of all, we created several normalized repositories: infrastructure, webservices, frontends. Each repository of the same category shares the same CLI/directory tree interface to avoid having to figure out what is where for each project.

### A docker image per repository

The subsequent fact of it is that each repository's goal is to contain the recipe to build a single Docker container.

### Modularization issues

But the modularization comes with its own costs and we had to automate their evolution to avoid falling into a messy codebase with disparate configurations for each project/microservice.

### An automated update process

Basically, what we're doing is maintaining a set of versioned macros that applies to a project once the module containing them is updated.

### Automatically Customized Documentation

Since building customer projects is like picking features in an existing toolbox plus creating specific ones, we automated the documentation in a way that allows us to spend 0 time on bundling it or on already documented features. We just focus on new features.

## Code Architecture

### Dependency Injection with Inversion of Control

We're using an open-source tool I made that implement Dependency Injection with Inversion of Control and looks similar to what's done in Angular. There is a small difference though, since it also handle service shutdown. Indeed, to ensure high availability we must shutdown services like PostgreSQL only when every connections to the HTTP server where closed.

### Pure functions for the win

A side effect of using services to enclose global states is that we can use pure functions everywhere else. I won't cover functional programming here but you should really have a look at its patterns.

### Documentation Driven APIs

Like any developer, I prefer write code than documentation. But I also prefer using documented code. To conciliate those two paradoxical needs, I managed to tie documentation and code. By writing the documentation, you create ([routing](https://github.com/nfroidure/siso), [input filtering](https://github.com/nfroidure/strict-qs), [clients API](https://github.com/nfroidure/asttpl/blob/master/src/realworld.mocha.js), ...).

### Workflow oriented controller

I am not an MVC fan. Indeed, experience proves that answering to an HTTP request is often more a unique workflow specific to a given endpoint. I would say I am using a Workflow Stages Service pattern where Workflow is a bunch of asynchronous sequential operation, Stages is about running pure functions or services functions and Service is just dealing with system's or third party global states.

### Cache ready

I think enforcing URLs uniqueness in the stricter manner possible is a very important thing. It makes caching strategy efficient. What's the point of taking trains to go to the office if your code is wasting resources? I want to code green and URI unicity is maybe the best improvement you can achieve for that matter.

It can be less convenient for frontends that are forced to follow a strict pattern when using the API but since we are generating the client API they don't even know that those restrictions exists ;).

Some old URIs contents are still varying but fortunately when frontends will all use the generated client API we will be able to change URIs transparently.

### Still a work in progress

Which leads us to the fact there is still some work in progress under the hoods. From JSONSchema definition to the RESTful shift, the road is long.

## Deployment

### One repository to rule them all

Building and deploying several projects at the same time requires to be rigorous and rely on single sources of truth. To handle this, every single utility script, deployment configuration lies in a single centralized repository per project.

Every repositories involved in a project are embedded into the infrastructure repository as a Git submodule in order to be able to setup the development environment by cloning a single repository.

### Cloud Hosting Powers

We managed to create scripts that aggregate each webservices/frontends definitions and output a platform agnostic project definition we can then convert for many targets: AWS, Google Cloud Engine or even a simple instance running Docker or PM2 if necessary.

### Back to the future

Since each project has its own hosting budget, traffic expectations, we want to provide more targets for deployments to precisely fit needs at the better cost.

### Quality Insurance

There is a lot of checks before shipping to UAT or production dramatically reducing risks to deploy non working versions. Most of the BDD tests I made also helped to ensure backward compatibility with the old APIs.

## Thanks

Thanks you for your attention. If you have any question, please ask ;).
