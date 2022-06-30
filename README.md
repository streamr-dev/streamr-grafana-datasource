## Streamr data source
### Streamr data source plugin for Grafana

Beam any [Streamr](https://streamr.network) stream to [Grafana](https://grafana.com). Configure and visualize streamed data.

#### Features
* Any permission-granted Streamr stream as data source
* Stream ID optional on plugin settings, can be defined as query
* Detection of field types [*](#notes)
* Data source health check on save

#### Installation
* Go to `Configuration` → `Data Sources`
* Click `Add data soruce`
* Select `Streamr` as data source
* Enter `Private Key` and `Stream ID` (optional)
* Click `Save & Test`

From now on Streamr can be selected as data source:
* Go to `Dashboard` → `New panel`
* Select `Streamr` as `Query` source

#### Notes
* Streamr field types aren't compatible to Grafana field types
