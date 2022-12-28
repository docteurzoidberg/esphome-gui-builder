# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.195.0/containers/javascript-node/.devcontainer/base.Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16-bullseye
#todo add python deps
ENV \
  DEBIAN_FRONTEND=noninteractive \
  DEVCONTAINER=true \
  PATH=$PATH:./webapp/node_modules/.bin

RUN \
    apt-get update \
    # Use pinned versions so that we get updates with build caching
    && apt-get install -y --no-install-recommends \
        python3=3.9.2-3 \
        python3-pip=20.3.4-4+deb11u1 \
        python3-setuptools=52.0.0-4 \
        python3-pil=8.1.2+dfsg-0.3+deb11u1 \
        python3-cryptography=3.3.2-1 \
        iputils-ping=3:20210202-1 \
        git=1:2.30.2-1 \
        curl=7.74.0-1.3+deb11u3 \
        openssh-client=1:8.4p1-5+deb11u1 \
    && rm -rf \
        /tmp/* \
        /var/{cache,log}/* \
        /var/lib/apt/lists/*

COPY requirements.txt  /
RUN \
    pip3 install --no-cache-dir -r /requirements.txt

