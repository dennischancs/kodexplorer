#!/opt/bin/env bash
apt-get -y update
apt-get -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository \
   "deb [arch=arm64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get -y  update
apt-get -y install docker-ce docker-ce-cli containerd.io

systemctl start docker
systemctl enable docker

cp docker-compose /usr/local/bin

chmod +x /usr/local/bin/docker-compose
