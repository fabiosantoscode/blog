---
title: March '20 DVC❤️Heartbeat
date: 2020-03-11
description: |
  DVC discussions around the web,
  our growing team, and reading recommendations from the open source communitys.
descriptionLong: |
  Every month we share news, findings, interesting reads, community takeaways,
  and everything else along the way.

  Look here for updates about [DVC](https://dvc.org), our journey as a startup,
  projects by our users and big ideas about best practices in ML and data
  science.
picture: ../../static/uploads/images/2020-03-11/march_cover.png
pictureComment:
author: ../authors/elle_obrien.md
commentsUrl: https://discuss.dvc.org/t/dvc-heartbeat-feburary-20/318
tags:
  - Heartbeat
  - Continuous Integration
  - Book
  - Data Science
---

Welcome to the March Heartbeat! Here are some highlights from our team and
community this past month:

## News

**DVC is STILL growing!** In February, Senior Software Engineer
[Guro Bokum](https://www.linkedin.com/in/jiojiajiu/) joined DVC. He's previously
contributed to the core DVC code base and brings several years of full-stack
engineering expertise to the team. Welcome, Guro!

[AWAITING PICTURE FROM GURO]

## From the community

First, there's an intriguing
[discussion evolving in the DVC repo](https://github.com/iterative/dvc/issues/3393)
about how machine learning hyperparameters (such as learning rate, number of
layers in a deep neural network, etc.) can be tracked. Right now,
hyperparameters are tracked as source code (i.e., with Git). Could we use some
kind of abstraction to separate hyperparameters from source code in a
DVC-managed project? Read on and feel free to jump into this discussion, largely
helmed by software developer and DVC contributor
[Helge Munk Jacobsen](http://elgehelge.github.io/).

Another discussion we appreciated happened on Twitter:

https://twitter.com/cyberomin/status/1223651811082559488

Thanks, [@cyberomin](https://twitter.com/cyberomin)!

Elsewhere on the internet, DVC made the cut in a much-shared blog,
[Five Interesting Data Engineering Projects](https://medium.com/@squarecog/five-interesting-data-engineering-projects-48ffb9c9c501)
by [Dmitry Ryaboy](https://twitter.com/squarecog) (VP of Engineering at biotech
startup Zymergen, and formerly Twitter). Dmitry wrote:

> To be honest, I’m a bit of a skeptic on “git for data” and various automated
> data / workflow versioning schemes: various approaches I’ve seen in the past
> were either too partial to be useful, or required too drastic a change in how
> data scientists worked to get a realistic chance at adoption. So I ignored, or
> even explicitly avoided, checking DVC out as the buzz grew. I’ve finally
> checked it out and… it looks like maybe this has legs? Metrics tied to
> branches / versions are a great feature. Tying the idea of git-like braches to
> training multiple models makes the value prop clear. The implementation, using
> Git for code and datafile index storage, while leveraging scalable data stores
> for data, and trying to reduce overall storage cost by being clever about
> reuse, looks sane. A lot of what they have to say in
> https://dvc.org/doc/understanding-dvc rings true.

Check out the full blog here:

<external-link
href="https://medium.com/@squarecog/five-interesting-data-engineering-projects-48ffb9c9c501"
title="Five Interesting Data Engineering Projects"
description="There’s been a lot of activity in the data engineering world lately, and a ton of really interesting projects and ideas have come on the scene in the past few years. This post is an introduction to (just) five that I think a data engineer who wants to stay current needs to know about."
link="medium.com"
image="/uploads/images/2020-03-11/dmitry_r.jpg"/>

One of the areas that DVC is growing into is continuous integration and
continuous deployment (CI/CD), a part of the nascent field of MLOps. Naturally,
we were thrilled to discover that CI/CD with DVC is taught in a new Packt book,
["Learn Python by Building Data Science Applications"](https://www.packtpub.com/programming/learn-python-by-building-data-science-applications)
by David Katz and Philipp Kats.

In the authors words, the goal of this book is to teach data scientists and
engineers "not only how to implement Python in data science projects, but also
how to maintain and design them to meet high programming standards." Needless to
say, we are considering starting a book club. Grab a copy here:

<external-link
href="https://www.packtpub.com/programming/learn-python-by-building-data-science-applications"
title="Learn Python by Building Data Science Applications"
description="Understand the constructs of the Python programming language and use them to build data science projects"
link="packtpub.com"
image="/uploads/images/2020-03-11/packt.jpeg"/>

Last year in Mexico, DVC contributor [Ramón Valles](https://github.com/mroutis)
gave a talk about reproducible machine learning workflows at Data Day Monterrey-
and [a video of his presentation](https://www.youtube.com/watch?v=tAxG-n20Di4)
is now online! In this Spanish-language talk, Ramón gives a thorough look at
DVC, particularly building pipelines for reproducible ML.

<external-link
href="https://www.youtube.com/watch?v=tAxG-n20Di4"
title="Experimentación ágil de machine learning con DVC"
description="Data Day Monterrey '19"
link="youtube.com"
image="/uploads/images/2020-03-11/dataday_mr.png"/>

Finally, DVC data scientist Elle (that's me!) released a new public dataset of
posts from the Reddit forum
[r/AmItheAsshole](https://reddit.com/r/amitheasshole), and reported some
preliminary analyses. We're inviting anyone and everyone to play with the data,
make some hypotheses and share their findings. Check it out here:

<external-link
href="https://blog.dvc.org/a-public-reddit-dataset"
title="AITA for making this? A public dataset of Reddit posts about moral dilemmas"
description="Delve into an open natural language dataset of posts about moral dilemmas from r/AmItheAsshole. Use this dataset for whatever you want- here's how to get it and start playing."
link="blog.dvc.org"
image="/uploads/images/2020-03-11/aita_sm.png"/>

That's all for now- thanks for reading, and be in touch on our
[GitHub](https://github.com/iterative/dvc),
[Twitter](https://twitter.com/dvcorg), and
[Discord channel](https://dvc.org/chat).
