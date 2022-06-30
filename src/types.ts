import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  streamId?: string;
}

export interface MyDataSourceOptions extends DataSourceJsonData {
  streamId: string;
  privateKey: string;
}

export interface StreamMetadata {
  messageId: {
    msgChainId?: string;
    publisherId?: string;
    sequenceNumber?: number;
    streamId: string;
    streamPartition?: number;
    timestamp: number;
  };
}
