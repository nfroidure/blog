---
title: Kafka avec docker-compose
description: Faire tourner Apache Kafka en local avec docker-compose.
leafname: kafka_docker_compose
link:
  label: Kafka et Docker
  title: Découvrez comment utiliser Kafka avec Docker compose
date: "2020-12-31T13:07:32.000Z"
lang: fr
location: FR
keywords:
  - Kafka
  - Docker
  - Kafdrop
categories:
  - Kafka
  - Docker
---

# Apache Kafka en local avec docker-compose

---

**Note rétrospective :**

Cet article reste utile mais depuis que Kafka ne nécessite plus Zookeeper, il est possible de directement exécuter Kafka via la commande `docker run`.

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

Le reste de l'article décrivant les interactions avec Kafka peuvent vous être utile surtout si vous comptez l'intégrer à un `docker-compose.yml` existant.

---

**TL; DR:**

```sh
curl -O https://gist.githubusercontent.com/nfroidure/720e83d6796a7c276f69ec8ad27fd7e9/raw/0bb69bbb8e8d97dd31f5b9dc3655fd6407910480/docker-compose.yml
docker-compose up
```

La donnée devient le centre de toute innovation, au fil de mes expériences professionnelles, il en est de plus en plus question. C'est donc naturellement que je me suis mis à utiliser le message queuing puis le stream processing.

D'abord avec Kinesis par simplicité, mais ce système ne gère pas les topics et est propriétaire ce qui est gênant pour rester cloud agnostique alors j'ai décidé de passer sous Kafka dans ma nouvelle aventure technologique chez DiagRAMS ;).

Le hic, c'est qu'il n'existe pas d'image Docker officielle, donc aucune documentation sur la façon de l'utiliser, d'où ce petit article qui vous aidera peut-être à éviter de passer trop de temps sur votre setup en local.

## Configurer docker-compose

Si, comme moi, vous ne jurez que par `docker-compose` pour le dev en local, alors voici ma petite recette perso !

Tout d'abord, j'ai choisi d'utiliser les images Docker de Bitnami à défaut d'images officielles (n'hésitez pas à proposer les votres en commentaire).

J'ai également déclaré explicitement le réseau que je souhaite utiliser et ceci pour deux raisons :

- je souhaite maitriser les plages IP utilisées par Docker afin d'éviter les collisions avec mes VPC (ce qui m'a causé pas mal de fil à retordre lors du setup de ma connexion VPN...),
- Apache Kafka utilise un système de diffusion des brokers et pour pouvoir s'y connecter en local, c'est mieux de connaitre l'adresse IP de ces derniers pour pouvoir les insérer dans la variable d'environnement `KAFKA_ADVERTISED_LISTENERS` prévue à cet effet.

Le résultat est le suivant :

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

Vous pouvez ajouter plus de brokers, il suffira alors d'adapter les variables d'environnement, mais en local, c'est rarement utile.

## Se connecter avec Kafdrop

On peut ajouter l'UI de Kafdrop directement au docker-compose, mais c'est quelque chose que j'évite pour ne pas avoir un environnement de développement trop gourmand en RAM.

De plus, ça peut être bien de pouvoir, sélectivement, démarrer Kafdrop pour le Kafka local, mais aussi pour voir ce qu'il se passe sur le Kafka de production.

Pour toutes ces raisons, et aussi car c'est plus écologique, je démarre directement Kafdrop quand j'en ai besoin via la ligne de commande :

```sh
docker run --rm -p 9000:9000 \
 -e KAFKA_BROKERCONNECT="10.5.0.1:9092" \
 -e JVM_OPTS="-Xms32M -Xmx256M" --network myapp \
 -e SERVER_SERVLET_CONTEXTPATH="/" \
 obsidiandynamics/kafdrop:latest
```

Notez bien le `--network myapp` qui permet à Kafdrop d'être sur le même réseau que le reste.

Je vous mets également la commande pour la production car cette dernière est sûrement en SSL et vous devrez donc y ajouter un peu de config comme suit :

```sh
docker run --rm -p 9000:9000 \
 -e KAFKA_BROKERCONNECT=$(node -e "process.stdout.write($(terraform output kafka_bootstrap_brokers))") \
 -e JVM_OPTS="-Xms128M -Xmx2G" -e KAFKA_PROPERTIES=$(echo security.protocol=SSL | base64) \
 -e SERVER_SERVLET_CONTEXTPATH="/" \
 obsidiandynamics/kafdrop:latest
```

Comme vous pouvez le voir, je récupère directement les brokers Kafka depuis mes states Terraform. Libre à vous d'en faire autant ou de les mettre à la main.

## Utiliser les scripts Kafka

En lisant la documentation de Kafka, vous devrez probablement utiliser les scripts mis à disposition par Kafka, voici, par exemple, comment créer un topic avec `docker-compose` :

```sh
docker-compose exec kafka /opt/bitnami/kafka/bin/kafka-topics.sh \
 --create \
 --bootstrap-server localhost:9092 \
 --replication-factor 1 \
 --partitions 1 \
 --topic users
```

La liste des commandes s'obtient facilement ainsi :

```sh
docker-compose exec kafka ls /opt/bitnami/kafka/bin
```

Kafka est une technologie sympa, je pense qu'elle est en revanche mal comprise, ce n'est qu'un système de gestion d'évènements, pas l'alpha et l'omega de la gestion massive de données.

Enfin, en terme de documentation, tous les chemins mènent à Confluent et je trouve cela regrettable qu'il n'y ait pas plus de documentation indépendante, d'où cet article, car l'intérêt d'utiliser du libre est limité si on depend d'un seul acteur cloud. Bref, j'attends vos retours d'expérience également ;).
