---
title: Leveraging docker-compose and SwaggerUI
description: Having a local SwaggerUI instance and deal with CORS by a single
  command to easily get your API documentation.
leafname: swagger_ui_docker_compose
link:
  label: Using SwaggerUI and docker-compose
  title: See how to use SwaggerUI and docker-compose altogether
date: "2022-02-04T10:00:00.000Z"
lang: en
location: US
keywords:
  - SwaggerUI
  - Docker
  - OpenAPI
categories:
  - SwaggerUI
  - Docker
  - OpenAPI
---

# Your API documentation locally with SwaggerUI and docker-compose

**TL; DR:**

```sh
git clone git@gist.github.com:79f6f33b6907af59fb496365cd7a5054.git swagger_compose
cd swagger_compose
NGINX_API_URL=https://api.example.com API_PATH=/v0/openAPI docker-compose up
```

Back-end developers often gets their own SwaggerUI instance while developing their own APIs. Accessing the API documentation is not a problem for them.

I often had to build APIs but there is still a moment when you don't want to put API docs online but you neither want to require your teammates to fork your project and run the whole project just for docs.

I encountered that situation at DiagRAMS since data scientists needed to get access to the docs but it was a bit overkill for them to clone and setup the project locally.

## OpenAPI goodness

I made a back-end framework (called [Whook](https://github.com/nfroidure/whook)) that leverage a nice standard for documenting APIs: [OpenAPI](https://www.openapis.org/).

You cannot create a new route without documenting it. It not only ties documenting and coding. It ensures that documentation and code cannot drift overtime thanks to TypeScript and the [schema2dts](https://github.com/nfroidure/schema2dts) project.

We plan to put our documentation online but we are currently moving fast on features and our API is not public at the moment. I also didn't want to create a new website for 3 visits a month, it wouldn't be green at all. So we needed a B plan.

## Docker to the rescue

As usual, Docker can be a great tool to give access to nice features locally. That way, you only run the server when you need it.

My first approach was to use `docker run` with a local copy of the OpenAPI declaration:

```sh
docker run -e "SWAGGER_JSON_URL=openapi.json" -v "$PWD/openapi.json:/usr/share/nginx/html/openapi.json" --rm -p 16640:8080 swaggerapi/swagger-ui
```

But I then evolved to something more live since our API serves its own OpenAPI file, let's just use it.

## Using docker-compose

I couldn't simply fill up the `SWAGGER_JSON_URL` with our documentation URL. Indeed, for security reasons, the CORS are enabled on our API and it simply doesn't work.

This is why I finally used 2 Docker images. One for SwaggerUI and another for proxying the API and change the` Access-Control-Allow-Origin` header.

I made it generic and write this blog post since I think it can benefit to you or my future self. So here is the code:

```yml
# From the Gist: https://gist.github.com/nfroidure/79f6f33b6907af59fb496365cd7a5054

version: "3.5"
networks:
  api_docs:
    name: "api_docs"
    driver: bridge
    # Avoid colliding with the AWS VPC subnet
    ipam:
      driver: default
      config:
        - subnet: 10.6.0.0/16
          ip_range: 10.6.0.0/24
          gateway: 10.6.0.1
          aux_addresses:
            swagger: 10.6.0.2
            api: 10.6.0.3
services:
  swagger:
    image: swaggerapi/swagger-ui
    networks:
      - "api_docs"
    ports:
      - "16640:8080"
    environment:
      - SWAGGER_JSON_URL=http://api.localhost:16641${API_PATH-/openapi.json}
  api:
    image: nginx
    networks:
      - "api_docs"
    volumes:
      - ./default.conf.template:/etc/nginx/templates/default.conf.template
    ports:
      - "16641:80"
    environment:
      - NGINX_HOST=_
      - NGINX_PORT=80
      - NGINX_API_URL
```

The same approach can be taken for allowing frontend developers to build the app without cloning the API.
