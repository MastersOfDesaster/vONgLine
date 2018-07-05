FROM openjdk:jre

WORKDIR /app/java

RUN apt-get update && apt-get -y install cron

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/delete-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/delete-cron

RUN curl -s https://api.github.com/repos/MastersOfDesaster/Vongpiler/releases/latest \
| grep "browser_download_url.*vongc.jar" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -

WORKDIR /app

CMD ["sh","-c","cron -f"]