---
layout: post
title: "Reading S3 data from local PySpark" 
description: blabla
tags:
---

Today I wanted to run some experiments with PySpark in EMR. Since running an EMR cluster is expensive I decided to first try the code on my local machine, and once I know what to try run it on the EMR cluster. It seems pretty straightforward, isn’t it? But it wasn’t…

My main problem was to read data from s3 from a locally installed PySpark. After googling I discovered several blog posts with overcomplicated solutions that didn’t work work. After spending some hours fighting with this problem I present you a minimal guide that works. No need of downloading jar files, no need of compiling spark yourself, no need of installing specific versions of PySpark.
# 0. The problem

Let’s start with the problem I started with. If you install PySpark as `pip install pyspark` and then run

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.getOrCreate()
foo = spark.read.parquet("s3://path/to/data")
```

you'll get the error

```
org.apache.hadoop.fs.UnsupportedFileSystemException: No FileSystem for scheme "s3"
```

There are two problems with this approach: (1) problems with the filesystem, and (2) problems with the credentials. I’ll solve these problems in the following sections.

# 1. Filesystem

S3 implements multiples interfaces to access the data, namely s3, s3a and s3n. I’m not an expert in this topic, for more info read this [post](https://luminousmen.com/post/choosing-the-right-aws-storage-service-a-comprehensive-guide-to-s3-s3n-and-s3a).

For our case we only need to know

> S3A (Amazon S3A File System) is a newer and recommended Hadoop-compatible interface for accessing data stored in S3. S3A was introduced as part of Apache Hadoop 2.7.0. It is built on top of the S3 protocol and uses the S3 object API to provide better performance, scalability, and functionality compared to S3N.

So, first we need to fix the URL. From `s3://path/to/data` to `s3a://path/to/data`. Notice the extra a. After applying this change we get a new error ([hooray](https://www.commitstrip.com/en/2018/05/09/progress/?))

```
java.lang.RuntimeException: java.lang.ClassNotFoundException: 
Class org.apache.hadoop.fs.s3a.S3AFileSystem not found
```

Spark no longer complains about the filesystem but about a missing class. This means that we miss libraries to read from s3a. To solve that we only need to add this missing dependency

```python
conf.set("spark.jars.packages", "org.apache.hadoop:hadoop-aws:3.2.0")
```

Now the code looks like

```python
from pyspark import SparkConf
from pyspark.sql import SparkSession

conf = SparkConf()
conf.set("spark.jars.packages", "org.apache.hadoop:hadoop-aws:3.2.0")
spark = SparkSession.builder.config(conf=conf).getOrCreate()
path = "s3a://path/to/data/"
spark.read.parquet(path)
```

The solution some blogs provide for this problem is to download from maven some jar files and the pass them to the spark configuration. I don't know if this was needed in the past, but currently you don't need to download external dependencies, you only need to specify them in the code and spark will take care of them.

However, after this change we still have one error ([hooray](https://www.commitstrip.com/en/2018/05/09/progress/?))

```
23/10/09 16:32:26 WARN FileSystem: Failed to initialize fileystem [s3a://path/to/data/](s3a://path/to/data): 
java.nio.file.AccessDeniedException: BUCKET: 
org.apache.hadoop.fs.s3a.auth.NoAuthWithAWSException: No AWS Credentials provided by TemporaryAWSCredentialsProvider : 
org.apache.hadoop.fs.s3a.CredentialInitializationException: Access key, secret key or session token is unset
```

# 2. Credentials

From the last Spark error we see we miss the credentials to read from S3. We can configure the credentials using

```python
conf.set("spark.hadoop.fs.s3a.access.key", "...")
conf.set("spark.hadoop.fs.s3a.secret.key", "...")
conf.set("spark.hadoop.fs.s3a.session.token", "...")
```

Since you don't want to have your secrets hard coded in your scripts I recommend reading them from the credentials file and injecting them

```python
import configparser

config = configparser.ConfigParser()
config.read("/Users/alexmolas/.aws/credentials")
access_key = config.get("prod", "aws_access_key_id")
secret_key = config.get("prod", "aws_secret_access_key")
session_token = config.get("prod", "aws_session_token")
```

# 3. Putting everything together

If we put all the changes together we get the following snippet

```python
from pyspark import SparkConf
from pyspark.sql import SparkSession
 
conf = SparkConf()
conf.set("spark.jars.packages", 
         "org.apache.hadoop:hadoop-aws:3.2.0")
conf.set("spark.hadoop.fs.s3a.aws.credentials.provider",
         "org.apache.hadoop.fs.s3a.TemporaryAWSCredentialsProvider")
conf.set("spark.hadoop.fs.s3a.access.key", "...")
conf.set("spark.hadoop.fs.s3a.secret.key", "...")
conf.set("spark.hadoop.fs.s3a.session.token", "...")
 
spark = SparkSession.builder.config(conf=conf).getOrCreate()

path = "s3a://path/to/data/"
spark.read.parquet(path)
```

and now everything runs smooth and you can play with PySpark locally.