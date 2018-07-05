FROM openjdk:jre

WORKDIR /app/java

RUN curl -s https://api.github.com/repos/MastersOfDesaster/Vongpiler/releases/latest \
| grep "browser_download_url.*vongc.jar" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -

WORKDIR /app

# Configure cron
ADD crontab /etc/cron.d/delete-cron

# Init cron
RUN chmod 0644 /etc/cron.d/delete-cron

CMD ["cron"]