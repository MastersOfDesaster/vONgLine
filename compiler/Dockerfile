FROM openjdk:jre

WORKDIR /app/java

RUN curl -s https://api.github.com/repos/MastersOfDesaster/Vongpiler/releases/latest \
| grep "browser_download_url.*vongc.jar" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -

WORKDIR /app