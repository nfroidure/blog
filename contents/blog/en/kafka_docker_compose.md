---
title: Kafka with docker-compose
description: Run Apache Kafka locally with docker-compose.
leafname: kafka_docker_compose
link:
  label: Kafka and Docker
  title: See how to use Kafka with docker-compose
date: "2020-12-31T13:07:32.000Z"
lang: en
location: US
keywords:
  - Kafka
  - Docker
  - Kafdrop
categories:
  - Kafka
  - Docker
  - Kafdrop
---

# Using Apache Kafka locally with docker-compose

---

**Retrospective note:**

The article contents remains useful, but since in the last Kafka versions Zookeeper is not required anymore, you may just run the following command to get you own instance running locally for dev purpose.

```sh
docker run -d --name kafka-server --hostname kafka-server \
  -e KAFKA_CFG_NODE_ID=0 \
  -e KAFKA_CFG_PROCESS_ROLES=controller,broker \
  -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
  -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka-server:9093 \
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  bitnami/kafka:latest
```

The rest of the article about interacting with Kafka is still relevant though if you want to manage it or integrate Kafka in an existing `docker-compose.yml` file.

---

**TL; DR:**

```sh
curl -O https://gist.githubusercontent.com/nfroidure/720e83d6796a7c276f69ec8ad27fd7e9/raw/0bb69bbb8e8d97dd31f5b9dc3655fd6407910480/docker-compose.yml
docker-compose up
```

Innovation is often driven by data. Through my various professional experiences, I naturally ended using message queuing and then streams processing.

I first tried Kinesis for its ease of use but it do not support topics and it is not open-source which is not good to stay cloud agnostic so I decided to switch to Kafka for my new position at DiagRAMS.

The thing is that there is no official Kafka docker image which lead to a lack of documentation on how to use it. This article may help you to spend less time on it than I had to.

## Configuring docker-compose

If you like using `docker-compose` for your developer environment, here is the recipe.

I chosen to use the Bitnami images (feel free to share yours!) since no official one exists at the time of this writing.

I also explicitly declare the network options for two main reasons:

- I need to choose the IP range range docker uses to avoid collisions with my various VPC (which led to a few annoying moments configuring my VPN connection...),
- Apache Kafka uses an advertising system to share the brokers hosts leading to an easier setup if you can rely on a fixed IP adresses for them to fill the `KAFKA_ADVERTISED_LISTENERS` environment variable.

Here is the result:

```yml
# From the Gist: https://gist.github.com/nfroidure/720e83d6796a7c276f69ec8ad27fd7e9
version: "3.5"
networks:
  myapp:
    name: "myapp"
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 10.5.0.0/16
          ip_range: 10.5.0.0/24
          gateway: 10.5.0.1
          aux_addresses:
            kafka: 10.5.0.2
            zookeeper: 10.5.0.3
services:
# See:
# https://hub.docker.com/r/bitnami/zookeeper
zookeeper:
  image: "bitnami/zookeeper:latest"
  container_name: "myapp-zookeeper"
  networks:
    - "myapp"
  ports:
    - "2181:2181"
  environment:
    - ALLOW_ANONYMOUS_LOGIN=yes

# See:
# https://hub.docker.com/r/bitnami/kafka
kafka:
  image: bitnami/kafka:2.5.0
  container_name: "myapp-kafka"
  networks:
    - "myapp"
  ports:
    - "9092:9092"
  environment:
    - KAFKA_BROKER_ID=1
    - KAFKA_LISTENERS=PLAINTEXT://:9092
    - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://10.5.0.1:9092
    - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
    - ALLOW_PLAINTEXT_LISTENER=yes
  depends_on:
    - zookeeper
```

You can add more brokers if you wish thought is it not generally useful for development. Just beware that you will have to tweak the various environment variables.

## Connecting with Kafdrop

Kafdrop can be directly added to the docker-compose file but I prefer not doing so to keep the development environment lighter.

It also allows to selectively run Kafdrop for both local and production environments.

So let's run Kafdrop once we need it with that simple command:

```sh
docker run --rm -p 9000:9000 \
 -e KAFKA_BROKERCONNECT="10.5.0.1:9092" \
 -e JVM_OPTS="-Xms32M -Xmx256M" --network myapp \
 -e SERVER_SERVLET_CONTEXTPATH="/" \
 obsidiandynamics/kafdrop:latest
```

Note that `--network myapp` allows Kafdrop to live in the same network than our Kafka brokers.

Here is the command for production were you will probably need to add the SSL configuration like this:

```sh
docker run --rm -p 9000:9000 \
 -e KAFKA_BROKERCONNECT=$(node -e "process.stdout.write($(terraform output kafka_bootstrap_brokers))") \
 -e JVM_OPTS="-Xms128M -Xmx2G" -e KAFKA_PROPERTIES=$(echo security.protocol=SSL | base64) \
 -e SERVER_SERVLET_CONTEXTPATH="/" \
 obsidiandynamics/kafdrop:latest
```

As you can see, I directly retrieve the Kafka brokers via my Terraform states, feel free to do so or simply add it by hands.

## Using Kafka scripts

By reading the Kafka docs, you will probably be prompted to use the scripts embedded by Kafka, here is, for example, how you would create a topic with the above setup:

```sh
docker-compose exec kafka /opt/bitnami/kafka/bin/kafka-topics.sh \
 --create \
 --bootstrap-server localhost:9092 \
 --replication-factor 1 \
 --partitions 1 \
 --topic users
```

Listing available commands is done simply that way:

```sh
docker-compose exec kafka ls /opt/bitnami/kafka/bin
```

Kafka is an interesting technology, that said, you should be aware that using Kafka is not on its own a passport for managing big data.

Finally, I found out that searching for documentation often leads to Confluent specific tutorial which is not great. I think that using free software should not be tied to a particular company so I hope more people will take some time to tell how to use raw Kafka, I will be glad to read it ;).
