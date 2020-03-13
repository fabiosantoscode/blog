---
title: March '20 Community Gems
date: 2020-03-12
description: |
  Great discussions and technical Q&A's from our users.
descriptionLong: |
  Look here every month for great discussions and technical Q&A's from our users 
  and core development team.
picture: ../../static/uploads/images/2020-03-12/march_20_header.png
author: ../authors/elle_obrien.md
commentsUrl: https://discuss.dvc.org/t/march-20-community-gems/336
tags:
  - Discord
  - Google Drive
  - Azure
  - Gems
  - Homebrew
---

## Discord gems

Here are some Q&A's from our Discord channel that we think are worth sharing.

### Q: I have several simulations organized with Git tags. I know I can compare the metrics with `dvc metrics diff [a_rev] [b_rev]`, substituting hashes, branches, or tags for [a_rev] and [b_rev]. [But what if I wanted to see the metrics for a list of tags?](https://discordapp.com/channels/485586884165107732/563406153334128681/687634347104403528)

DVC has a built in function for this! You can use

```dvc
$ dvc metrics show -T
```

to list the metrics for all tagged experiments.

Also, we have a couple of relevant discussions going on in our GitHub repo about
[handling experiments](https://github.com/iterative/dvc/issues/2799) and
[hyperparameter tuning](https://github.com/iterative/dvc/issues/3393). Feel free
to join the discussion and let us know what kind of support would help you most.

### Q: [Is there a recommended way to save metadata about the data in a `.dvc` file?](https://discordapp.com/channels/485586884165107732/563406153334128681/685105104340386037) In particular, I'd like to save summary statistics (e.g., mean, minimum, and maximum) about my data.

One simple way to keep metadata in a `.dvc` file is by using the `meta` field.
Each `meta` entry is a `key:value` pair (for example, `name: Jean-Luc`). The
`meta` field can be manually added or written programmatically, but note that if
the `.dvc` file is overwritten (perhaps by `dvc run`, `dvc add`, or
`dvc import`) these values will not be preserved. You can read more about this
[in our docs](https://dvc.org/doc/user-guide/dvc-file-format).

Another approach would be to track the statistics of your dataset in a metric
file, just as you might track performance metrics of a model. For a tutorial on
using DVC metrics please
[see our docs](https://dvc.org/doc/command-reference/metrics).

### Q: My team has been using DVC in production. We build models locally, manage them with DVC, and deploy them in docker containers (note that the docker containers don't contain a Git repo). When we upgraded from DVC version 0.71.0, we started getting an error message: `ERROR: unexpected error - /my-folder is not a git repository`. [What's going on?](https://discordapp.com/channels/485586884165107732/485596304961962003/687403454989467650)

This is a consequence of new support we've added for monorepos with the
`dvc init --subdir` functionality
([see more here](https://dvc.org/doc/command-reference/init#init)), which lets
there be multiple DVC repositories within a single Git repository. Now, if a DVC
repository doesn't contain a `.git` directory, DVC expects the `--no-scm` flag
to be present in `.dvc/config` and raises an error if not.

You can fix this by running `dvc config core.no_scm true`; perhaps you could
include this command in the script that creates Docker images. You could
alternately include `.git` in your Docker container, but this is not advisable
for all situations.

We are currently working to add graceful error-handling for this particular
issue so stay tuned.

### Q: In my workflow, I need to periodically update the dataset in my local environment and then retrain my model. Currently I use `dvc pull` to sync my local dataset, followed by `dvc repro` to rerun my DVC pipeline that trains the model. [Is there a way to force the pipeline to rerun, even if its dependencies haven't changed (i.e., their MD5 hashes are unmodified)?](https://discordapp.com/channels/485586884165107732/563406153334128681/687422002822381609)

Yes, `dvc repro` has a flag that should help here. You can use the `-f` or
`--force` flag to reproduce the pipeline even when no changes in the
dependencies have been found. So if you had a hypoethetical DVC pipeline whose
final process was `deploy.dvc`, you could run `dvc repro -f deploy.dvc` to rerun
the whole pipeline, even if the dataset hasn't changed.

### Q: I'm using SSH remote data storage in my DVC project. [Is there any way to set up role based access credentials (RBAC) for our data?](https://discordapp.com/channels/485586884165107732/563406153334128681/683993824879443968) We'd like to make sure our remote storage has restricted access.

As long as your users can't access the remote storage manually, they won't be
able to access it with DVC. Create a group of of users with access privileges to
your SSH storage (or the data repository inside).

### Q: What's the best way to orgnize DVC repositories if I have several training datasets shared by several projects? Some projects use only one dataset while other use several. [Can one project have `.dvc` files corresponding to different remotes?](https://discordapp.com/channels/485586884165107732/563406153334128681/670664813973864449)

Yes, one project directory can contain datasets from several different DVC
remotes. What you want is the `dvc import` function- it lets you pull files
(like datasets) into your current workspace from any remote repository. For
example, to get datasets `dataset1`,`dataset2`, and `dataset3` from different
repositories in your organization's S3 remote, you could run

```dvc
$ dvc import s3://myproject/dataset1
$ dvc import s3://anotherproject/dataset2
$ dvc import s3//yetanotherproject/dataset3
```

This would import three unique datasets into your local environment, as well as
the `.dvc` files corresponding to them. Then, when you use Git to version the
current workspace, you'll have records of the remote storage where each dataset
comes from.

For more examples like this, please
[see our tutorial on data registries](https://dvc.org/doc/use-cases/data-registries).
