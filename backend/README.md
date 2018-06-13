# wetterdaten

Diese Software dient dem [SolarCar Team der Hochschule Bochum](http://www.bosolarcar.de) als Microservice für Wetterdaten.
Dieser Service Cache Wetterdaten, die von [Meteomatics](http://www.meteomatics.com) zur Verfügung gestellt werden, um diese jeder Zeit abrufen zu können.

Zusätzlich werden Wetterdaten interpoliert, wenn für eine angefragte Koordinate keine Daten im Cache liegen.

## Inhaltsverzeichnis

- [1 Anwenderdokumentation](#1-anwenderdokumentation)
  - [1.1 Vorbereitungen](#11-vorbereitungen)
  - [1.2 Starten](#12-starten)
    - [1.2.1 Config](#121-config)
    - [1.2.2 Docker bauen](#122-docker-bauen)
    - [1.2.3 Docker starten](#123-docker-starten)
  - [1.3 Wetterdaten abfragen](#13-wetterdaten-abfragen)
    - [1.3.1 \<time>](#131-time)
    - [1.3.2 \<parameters>](#132-parameters)
    - [1.3.3 \<location>](#133-location)
  - [1.4 Weitere Informationen](#14-weitere-nformationen)
- [2 Entwicklerdokumentation](#2-entwicklerdokumentation)
  - [2.1 Voraussetzungen](#21-voraussetzungen)
  - [2.2 Einrichtung](#22-einrichtung)
  - [2.4 Node Module](#23-node-module)
  - [2.4 Funktionsumfang](#24-funktionsumfang)
    - [2.4.1 Umwandeln der Anfragen](#241-umwandeln-der-anfragen)
    - [2.4.2 Cachen von Daten](#242-cachen-der-daten)
    - [2.4.3 Interpolieren den Wetterdaten](#243-interpolieren-der-wetterdaten)
    - [2.4.4 REST Schnittstelle](#244-rest-schnittstelle)
  - [2.5 Module](#25-module)
    - [2.5.1 Model](#251-model)
    - [2.5.2 Util](#252-util)

## 1 Anwenderdokumentation

### 1.1 Vorbereitungen

Der Microservice läuft in einem Docker Container. Daher muss auf dem Zielsystem, auf dem dieser laufen soll, [Docker](https://docs.docker.com/install/) installiert sein. Die Anleitung dazu ist oben verlinkt.

### 1.2 Starten

Zuerst muss der Quellcode aus diesem Repository entweder mit git geklont werden oder als Archiv heruntergeladen und entpackt werden.

#### 1.2.1 Config

Wenn nichts anderes eingestellt wird, wird der Service mit folgenden Einstellungen gestartet:

- Zeit bis Daten aktualisiert werden = `15 min`
- Benutzername für das Meteomatics Konto = `solarcar`
- Passwort für das Meteomatics Konto = `das aktuelle`
- Port auf dem die REST Schnittstelle läuft = `3000`
- URL für die Meteomatics Schnittstelle = `https://api.meteomatics.com`

Diese Werte können in folgender Datei angepasst werden

```console
./src/model/Config.ts
```

#### 1.2.2 Docker bauen

Im Ordner des Projekts muss folgender Befehl ausgeführt werden, um das Docker Image zu erstellen.

```console
docker build -t solarcarwetterdaten .
```

#### 1.2.3 Docker starten

Nachdem das Docker Image erstellt wurde, wird es mit folgendem Befehl gestartet.

```console
docker run -p 3000:3000 solarcarwetterdaten
```

Mit `-p 3000:3000` wird der Port von dem Image an die Hostmaschine übergeben. Hier kann mit der zweiten Zahl ein anderen Port auf dem Hostsystem gewählt werden.

### 1.3 Wetterdaten abfragen

Nachdem der Micoservice gestartet wurden ist dieser mit den Standardeinstellungen unter folgender URL erreichbar:

```console
http://localhost:3000
```

Die Schnittstelle ist wie folgt aufgebaut. Weiter unten werden die einzelnen Optionen erklärt:

```console
http://localhost:3000/<time>/<parameters>/<location>/json
```

#### 1.3.1 \<time>

[Quelle](https://api.meteomatics.com/API-Request.html#time-description)

|Time|Description|Example|
|--- |--- |--- |
|Single point UTC|`<isodate>`|`2015-01-20T18Z` - 20th January 2015, 18:00 UTC|
|Single point local time|`<isodate>`|`2015-01-20T14:35+01:00` - 20th January 2015, 14:35, time zone UTC+01:00|
|Time Period (fixed length)|`<isodate>P<duration>:P<step>`|`2017-05-28T13:00:00ZP10D:PT1H` (a period of 10 days with a step size of 1 hour) Options for duration and step: 1D: 1 day 1W: 1 week 1M: 1 month1Y: 1 year T1H: 1 hour T1M: 1 minuteT1S: 1 second and combinations of the previous, e.g. 1DT1H|
|Time Period (fixed end)|`<isodate>--<isodate>:P<step>`|`2017-05-28T13:00:00Z--2017-05-30T13:00:00Z:P1D` (a period between two dates with step size of 1 day Options for duration and step:1D: 1 day 1W: 1 week 1M: 1 month1Y: 1 year T1H: 1 hour T1M: 1 minuteT1S: 1 second and combinations of the previous, e.g. 1DT1H|
|Shortcut now|`<shortcut>[<shift>`]|`now`, `now+1H`, `now-30M`|
|Shortcuts today, yesterday, tomorrow|`<shortcut>[<shift>]`|`today`, `today+1D`, `yesterday-2D`, `yesterdayT00:00:00Z--tomorrow+1DT12:00:00Z:PT1H` (a period from yesterday at noon (UTC) to the day after tomorrow at noon (UTC) with 1-hour step)|

#### 1.3.2 \<parameters>

Es können mehrer Parameter übergeben werden. Diese werden mit Komma `,` aneinander gelistet.

[Komplette Liste aller Parameter](https://api.meteomatics.com/ParameterTableGerman.html)

#### 1.3.3 \<location>

[Quelle](https://api.meteomatics.com/API-Request.html#coordinate-description)

|Geometry|Description|Example|
|--- |--- |--- |
|Single point|`<lat>,<lon>`|`47.419708,9.358478`|
|Point list|`<lat1>,<lon1>+...+<latN>,<lonN>`|`47.41,9.35+47.51,8.74+47.13,8.22`|
|Line|`<start_point>_<end_point>:<number_of_points>`|`50,10_50,20:100`|
|Polyline|`<segment1_start_point>_<segment1_end_point>:<number_of_segment1_points>+<segment2_end_point>:<number_of_segment2_points> ` The start point of each segment is the end point of the previous segment.|`50,10_50,20:100+60,20:10, 47.42,9.37_47.46,9.04:10+47.51,8.78:10+47.39,8.57:10`|
|Rectangle (fixed number of points)|`<lat_max>,<lon_min>_<lat_min>,<lon_max>:<number_lons>x<number_lats>`|`50,10_40,20:100x100`|
|Rectangle (fixed resolution)|`<lat_max>,<lon_min>_<lat_min>,<lon_max>:<resolution_lat>,<resolution_lon>`|`50,10_40,20:0.1,0.1`|
|Rectangle shortcuts|`<shortcut>:<resolution_lat>,<resolution_lon>`|`europe:0.1,0.1,north-atlantic:100x100`|
|Postal (Zip) Codes|`postal_<country_code><zip_code> Country code refers to ISO3166-1 alpha-2 values`|`postal_CH9014,postal_DE10117`|

#### 1.3.4 Interpolation

Wenn Daten aus dem Cache interpoliert werden soll, muss an die Anfrage `?interpolation=true` gehängt werden.

```console
http://localhost:3000/<time>/<parameters>/<location>/json?interpolation=true
```

### 1.4 Weitere Informationen

Die REST-Schnittstelle ist der von Meteomatics nachempfunden.
Daher kann man sich dort über alle Möglichkeiten informieren:
[Meteomatics API](https://api.meteomatics.com).

## 2 Entwicklerdokumentation

### 2.1 Voraussetzungen

- Node.js `8.0.0`
- npm `5.7.1`
- TypeScript `2.7.2`
- git

### 2.2 Einrichtung

Die Einrichtung der Entwicklungsumgebung kann nach dieser [Anleitung](https://gitlab.com/bosolarcar/Typescript-node-module-example) erfolgen.

Anschließenden müssen folgenden Punkte ausgeführt werden.

```console
git clone https://fbecloud.hs-bochum.de:30000/SolarCar/wetterdaten.git
```

```console
cd wetterdaten
```

```console
npm install
```

Mit folgendem Befehl können die Tests gestartet werden:

```console
npm run test
```

### 2.3 Node Module

Folgende Node Module kommen bei diesem Projekt zum Einsatz:

- [express](https://github.com/expressjs/express) `4.16.3`
- [geolib](https://github.com/manuelbieh/geolib) `2.0.24`
- [moment](https://github.com/moment/moment/) `2.21.0`
- [web-request](https://github.com/davetemplin/web-request) `1.0.7`
- [winston](https://github.com/winstonjs/winston) `2.4.1`

### 2.4 Funktionsumfang

Der Microservice bietet verschieden Funktionen an.

#### 2.4.1 Umwandeln der Anfragen

Anfragen die mehr als eine Koordinate enthalten werden in eine Rechteckabfrage umgewandelt werden. Dazu wird ein Rechteck berechnet, dass alle Koordinaten enthält. Diese Abfrage wird im Anschluss an Meteomatics gesendet.

#### 2.4.2 Cachen von Daten

Sobald die erste Anfrage eingeht werden die abgefragten Daten zwischen gespeichert.
Diese werden im Hintergrund automatisch alle 15 Minuten aktualisiert.

Sollte eine Aktualisierung nicht erfolgreich sein wird alle 30 Sekunden diese erneut abzufragen. Sobald sie erfolgreich war, findet die nächste Abfrage erst nach 15 Minuten statt.

#### 2.4.3 Interpolieren den Wetterdaten

Wenn die Option für die Interpolation mitgeschickt wird, wird der Wert für die angefragte Koordinate oder Koordinaten aus den Daten im Cache berechnet.

Dazu wird im ersten Schritt geprüft, ob die Koordinate oder Koordinaten innerhalb der Daten im Cache liegt.

Anschließenden wird die Entfernung zu den umliegenden Koordinaten berechnet und fließt in die Gewichtung bei der Berechnung mit ein.

#### 2.4.4 REST Schnittstelle

Die REST Schnittstelle wurde im Aufbau der von Meteomatics nachempfunden. Genaueres steht in der Anwenderdokumentation bzw. ist in der [Meteomatics API](https://api.meteomatics.com) Dokumentation zu finden.

### 2.5 Module

#### 2.5.1 Model

- [Config](docs/md/modules/_model_config_.md)
- [Coord](docs/md/modules/_model_coord_.md)
- [Data](docs/md/modules/_model_data_.md)
- [DistanceValue](docs/md/modules/_model_distancevalue_.md)
- [Response](docs/md/modules/_model_response_.md)

#### 2.5.2 Util

- [LocationUtil](docs/md/modules/_util_locationutil_.md)
- [MathUtil](docs/md/modules/_util_mathutil_.md)
- [ObjectUtil](docs/md/modules/_util_objectutil_.md)
- [ParameterUtil](docs/md/modules/_util_parameterutil_.md)
- [RequestUtil](docs/md/modules/_util_requestutil_.md)
- [ResponseUtil](docs/md/modules/_util_responseutil_.md)
- [TimeUtil](docs/md/modules/_util_timeutil_.md)