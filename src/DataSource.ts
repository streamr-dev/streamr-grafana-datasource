// @ts-ignore
import StreamrClient from 'streamr-client';
import { Observable, merge } from 'rxjs';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  CircularDataFrame,
  DataSourceInstanceSettings,
  FieldType,
  LoadingState,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, StreamMetadata } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  privateKey: string;
  streamId: string;
  noAddedFields: boolean;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.privateKey = instanceSettings.jsonData.privateKey;
    this.streamId = instanceSettings.jsonData.streamId;
    this.noAddedFields = true;
  }

  query(options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
    const observables = options.targets.map((target) => {
      const query = target;
      const { refId } = query;

      const streamId = (query.streamId || this.streamId).toString();
      const privateKey = this.privateKey;
      const resend = {
        from: {
          timestamp: options.range.from.valueOf(),
        },
        to: {
          timestamp: options.range.to.valueOf(),
        },
      };

      if (!streamId) {
        throw new Error('Streamr Stream ID is required');
      }

      if (!privateKey) {
        throw new Error('Streamr Private Key is required');
      }

      const streamrClient = new StreamrClient({ auth: { privateKey } });

      return new Observable<DataQueryResponse>((subscriber: any) => {
        const frame = new CircularDataFrame({
          append: 'tail',
          capacity: options.maxDataPoints || 10000,
        });

        frame.refId = refId;
        frame.addField({ name: 'time', type: FieldType.time });

        streamrClient.subscribe({ id: streamId, resend }, (payload: any, metadata: Object) => {
          if (!payload || !metadata) {
            return;
          }

          const { messageId } = metadata as StreamMetadata;
          const time = messageId.timestamp;

          if (this.noAddedFields) {
            for (const [key, value] of Object.entries(payload)) {
              frame.addField({ name: key, type: this.getValueType(value) });
            }

            this.noAddedFields = false;
          }

          frame.add({ time, ...payload });

          subscriber.next({
            data: [frame],
            key: refId,
            state: LoadingState.Streaming,
          });
        });
      });
    });

    return merge(...observables);
  }

  /*
        Get value type because Streamr field types
        aren't compatible to Grafana field types
    */
  getValueType(value: any): FieldType {
    switch (typeof value as string) {
      case 'string':
        return FieldType.string;
      case 'boolean':
        return FieldType.boolean;
      case 'number':
        if (new Date(value).getFullYear() > 1970) {
          return FieldType.time;
        }
        return FieldType.number;
      default:
        return FieldType.other;
    }
  }

  testDatasource(): Promise<any> {
    const streamId = this.streamId;
    const privateKey = this.privateKey;

    return new Promise(async (resolve, reject) => {
      if (!privateKey) {
        return reject({
          status: 'error',
          message: 'Streamr Private Key is required',
        });
      }

      try {
        const streamrClient = new StreamrClient({ auth: { privateKey } });

        /*if (streamrClient.options.auth.privateKey !== `0x${privateKey}`) {
          return reject({
            status: 'error',
            message: 'Invalid Private Key',
          });
        }*/

        if (streamId) {
          const stream = await streamrClient.getStream(this.streamId);

          if (stream.id) {
            return resolve({
              status: 'success',
              message: `Successfully fetched stream "${stream.id}"`,
            });
          }

          return reject({
            status: 'error',
            message: 'Failed to fetch the stream',
          });
        }

        return resolve({
          status: 'success',
          message: 'Successfully updated plugin settings',
        });
      } catch (error: any) {
        return reject({
          status: 'error',
          message: error.message,
        });
      }
    });
  }
}
