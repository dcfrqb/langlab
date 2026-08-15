# PocketBase — бэкенд langlab. Один бинарник, версия прибита гвоздями:
# обновление = поднять PB_VERSION и пересобрать, а не «оно само подтянулось».
FROM alpine:3.21

ARG PB_VERSION=0.39.11

RUN apk add --no-cache ca-certificates unzip wget \
 && wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -O /tmp/pb.zip \
 && unzip -q /tmp/pb.zip -d /pb/ \
 && rm /tmp/pb.zip \
 && apk del unzip wget

EXPOSE 8090

# наружу порт не смотрит — его проксирует nginx (см. server/README.md)
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
