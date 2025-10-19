# genai-toolbox

https://github.com/googleapis/genai-toolbox

## How to start toolbox with MySQL using Docker Compose

```
$ docker compose up -d

$ docker compose ps
NAME                      IMAGE                                                                COMMAND                  SERVICE   CREATED         STATUS                                  PORTS
genai_toolbox-mysql-1     mysql:8.0                                                            "docker-entrypoint.s…"   mysql     5 seconds ago   Up 4 seconds                            3306/tcp, 33060/tcp
genai_toolbox-toolbox-1   us-central1-docker.pkg.dev/database-toolbox/toolbox/toolbox:0.11.0   "/toolbox --tools-fi…"   toolbox   5 seconds ago   Restarting (1) Less than a second ago
```

tools.yamlを編集した後にtoolboxコンテナを再起動するには、以下のコマンドを実行します。

```
$ docker compose restart toolbox
```

Mysql コンテナに接続して、データベースの内容を確認するには、以下のコマンドを実行します。

```
$ docker exec -it genai_toolbox-mysql-1 mysql nova -uadmin -padminpass
mysql> show tables
...

mysql> select * from instances;
...
```

## UI

http://dev01.pm.local.test:5000/ui/tools
