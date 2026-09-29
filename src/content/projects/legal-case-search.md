---
title: "Legal Case Search"
description: "A search index for Australian legal case reports, tagged with the people, places and organisations they mention."
date: 2019-10-20
status: archived
repo: "https://github.com/anchitv/Data-Curation-and-Indexing-with-ElasticSearch"
tags: ["scala", "search", "university", "spark", "elasticsearch", "corenlp", "xml", "nlp"]
draft: false
---

A university project that makes legal case reports searchable by the people, places and organisations in them.

## What it does

- Reads legal case reports stored as XML files.
- Finds people, locations and organisations in the text using Stanford CoreNLP's REST API.
- Adds those names to each case, then loads the cases into an Elasticsearch index.
- Lets you search by type, for example every case that mentions Melbourne.

## Built with

- Scala
- Apache Spark
- Stanford CoreNLP
- Elasticsearch
